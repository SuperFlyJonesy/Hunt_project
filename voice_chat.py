import asyncio
import io
import os
import re
import subprocess
import time
import edge_tts
import keyboard
import numpy as np
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
from google import genai
from google.genai.errors import APIError

def list_directory(folder_path: str = ".") -> str:
    """Lists files and directories at the specified path."""
    try:
        resolved = os.path.abspath(folder_path)
        if not os.path.exists(resolved):
            return f"Path not found: {resolved}"
        items = os.listdir(resolved)
        return "\n".join(items) if items else "Directory is empty."
    except Exception as e:
        return f"Error listing path: {e}"

def read_file(file_path: str) -> str:
    """Reads and returns the contents of a specified local file."""
    try:
        resolved = os.path.abspath(file_path)
        if not os.path.isfile(resolved):
            return f"File does not exist: {resolved}"
        with open(resolved, "r", encoding="utf-8", errors="replace") as f:
            content = f.read(4000)
            return content if content else "File is empty."
    except Exception as e:
        return f"Error reading file: {e}"

def run_powershell_command(command: str) -> str:
    """Runs a non-interactive PowerShell command on the system and returns its output."""
    try:
        proc = subprocess.run(
            ["powershell", "-NoProfile", "-Command", command],
            capture_output=True,
            text=True,
            timeout=15
        )
        out = proc.stdout.strip()
        err = proc.stderr.strip()
        if err:
            return f"Output: {out}\nErrors: {err}"
        return out if out else "Command completed with no output."
    except Exception as e:
        return f"Execution error: {e}"

client = genai.Client()
chat = client.chats.create(
    model="gemini-3.6-flash",
    config={
        "tools": [list_directory, read_file, run_powershell_command],
        "system_instruction": (
            "You have access to local tools to inspect files and run PowerShell commands. "
            "Examine local scripts and paths directly when asked. "
            "Keep spoken responses concise, punchy, and direct."
        )
    }
)
recognizer = sr.Recognizer()
VOICE = "en-GB-RyanNeural"

def play_audio(data_bytes: bytearray):
    if not data_bytes:
        return
    with io.BytesIO(data_bytes) as fp:
        data, rate = sf.read(fp, dtype="float32")
        sd.play(data, rate)
        sd.wait()

async def speak_neural(text: str):
    clean = re.sub(r"[\*#_`]", "", text).strip()
    if not clean:
        return
    communicate = edge_tts.Communicate(clean, VOICE)
    buf = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            buf.extend(chunk["data"])
    play_audio(buf)

def send_message_with_retry(chat_session, message: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            return chat_session.send_message(message)
        except APIError as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait_seconds = 5 * (attempt + 1)
                print(f"Rate limited by API. Pausing for {wait_seconds} seconds...")
                time.sleep(wait_seconds)
            else:
                raise e
    return None

def record_push_to_talk(sample_rate: int = 16000) -> str:
    print("\nHold [SPACEBAR] to talk (or press ESC to quit)...")
    
    while True:
        if keyboard.is_pressed("esc"):
            return "exit"
        if keyboard.is_pressed("space"):
            break
        time.sleep(0.02)
        
    print("Recording... (release SPACEBAR when done)")
    frames = []
    chunk_size = int(sample_rate * 0.05)
    
    with sd.InputStream(samplerate=sample_rate, channels=1, dtype="int16", blocksize=chunk_size) as stream:
        while keyboard.is_pressed("space"):
            data, _ = stream.read(chunk_size)
            frames.append(data)
            
    print("Processing...")
    if not frames:
        return ""
        
    raw_audio = np.concatenate(frames, axis=0).tobytes()
    audio = sr.AudioData(raw_audio, sample_rate, 2)
    
    try:
        text = recognizer.recognize_google(audio)
        print(f"You: {text}")
        return text
    except (sr.UnknownValueError, sr.RequestError):
        print("No clear speech detected.")
        return ""

print("--- Gemini Local Tool-Enabled Voice Terminal Active ---")

while True:
    try:
        user_input = record_push_to_talk()
        if not user_input:
            continue
            
        if user_input.lower() in ("exit", "quit", "stop"):
            break
            
        response = send_message_with_retry(chat, user_input)
        if response is None:
            reply = "Request rate limit exceeded. Please wait a moment and try again."
        else:
            reply = response.text or "Done."
            
        print(f"Gemini: {reply}")
        asyncio.run(speak_neural(reply))
        
    except KeyboardInterrupt:
        break
    except Exception as e:
        print(f"Error: {e}")

import os
from pathlib import Path
from datetime import datetime
from PIL import Image

def get_true_creation_date(file_path):
    """Gets the true photo taken date from EXIF. Falls back to OS modification time."""
    try:
        with Image.open(file_path) as img:
            exif = img._getexif()
            if exif:
                for tag in [36867, 306]: # DateTimeOriginal or DateTime
                    if tag in exif:
                        date_str = exif[tag]
                        dt_obj = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
                        return dt_obj.strftime("%d%m%Y")
    except Exception:
        pass 

    # Fallback to last modified time
    timestamp = os.path.getmtime(file_path)
    return datetime.fromtimestamp(timestamp).strftime("%d%m%Y")

def fix_processed_files(target_dir):
    target_path = Path(target_dir)
    pic_dir = target_path / "Pictures"
    
    if not pic_dir.exists():
        print(f"Directory {pic_dir} not found.")
        return

    print("Scanning already processed files to fix dates and bad names...")
    fixed_count = 0

    # Go through all pictures in the destination folder
    for file_path in pic_dir.rglob('*'):
        if not file_path.is_file() or file_path.suffix.lower() not in ['.jpg', '.jpeg', '.png']:
            continue
            
        current_name = file_path.name
        stem = file_path.stem
        ext = file_path.suffix.lower()
        
        # Check if the file matches our format: 8 digits, an underscore, then the AI name
        # Example: 17032013_RedCar
        if len(stem) > 9 and stem[:8].isdigit() and stem[8] == '_':
            old_date_str = stem[:8]
            subject_name = stem[9:]
            
            # --- Fix the "Numbers Only" bug from the old script ---
            # If the subject name is just a number (e.g., 17032013_12345.jpg)
            base_subject = subject_name.split('_')[0] # Ignores counter like _1
            if base_subject.isdigit():
                subject_name = f"UnidentifiedSubject_{subject_name}"
            
            # --- Get the True Date ---
            true_date_str = get_true_creation_date(file_path)
            
            # If the date was wrong OR the name needed fixing, rename it
            if old_date_str != true_date_str or subject_name != stem[9:]:
                new_filename = f"{true_date_str}_{subject_name}{ext}"
                new_file_path = file_path.parent / new_filename
                
                # Prevent overwriting if a file with the new exact name already exists
                counter = 1
                base_new_filename = f"{true_date_str}_{subject_name}"
                while new_file_path.exists() and new_file_path != file_path:
                    new_filename = f"{base_new_filename}_{counter}{ext}"
                    new_file_path = file_path.parent / new_filename
                    counter += 1
                    
                if new_file_path != file_path:
                    print(f"Fixed: '{current_name}'  --->  '{new_filename}'")
                    file_path.rename(new_file_path)
                    fixed_count += 1

    print("\n" + "=" * 60)
    print(f"DONE! Successfully corrected {fixed_count} files.")
    print("=" * 60)

if __name__ == "__main__":
    # Point this strictly to your output folder
    SAFE_OUTPUT_FOLDER = r"I:\HappyHappyJoyJoy" 
    
    try:
        fix_processed_files(SAFE_OUTPUT_FOLDER)
    except Exception as e:
        print(f"ERROR: {e}")
from firebase_admin import db
from firebase_admin import storage

def get_file_from_storage(file_path):
    # Getting the file from Firebase Storage
    bucket = storage.bucket()
    blob = bucket.blob(file_path)

    # Checking if the file exists
    if not blob.exists():
        return None

    # Downloading the file as bytes
    file_bytes = blob.download_as_bytes()
    return file_bytes

def get_family_member_details(FamilyID):
    ref = db.reference(f'FamilyMembers/{FamilyID}')
    member_details = ref.get()
    return member_details


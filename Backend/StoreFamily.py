from firebase_admin import db, storage
from uuid import uuid4

def upload_image_to_storage(image_file, FamilyID):
    # Generating a unique filename for the image
    if image_file:
        Filename = f"FamilyMembers/{FamilyID}/{FamilyID}ImageFile.{image_file.filename.split('.')[-1]}"

        # Uploading the image to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(Filename)
        blob.upload_from_file(image_file, content_type=image_file.content_type)

        # Making the image publicly accessible (To provide URL to the real-time database)
        blob.make_public()

        # Returning the public URL of the uploaded image
        return blob.public_url
    return image_file

def upload_video_to_storage(video_file, FamilyID):
    # Generating a unique filename for the video
    if video_file:
        filename = f"FamilyMembers/{FamilyID}/{uuid4()}.{video_file.filename.split('.')[-1]}"

        # Uploading the video to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(filename)
        blob.upload_from_file(video_file)

        # Making the video publicly accessible (same reason as for image)
        blob.make_public()

        # Return the public URL of the uploaded video
        return blob.public_url
    return video_file

def save_user_details(FamilyID, name, relation, age,interests, image_url,video_url):
    ref = db.reference(f'FamilyMembers/{FamilyID}')
    ref.set({
        'name': name,
        'relation': relation,
        'age': age,
        'interests': interests,
        'image_url': image_url,
        'video_url': video_url
    })

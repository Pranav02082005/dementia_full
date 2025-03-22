import cv2
import face_recognition
import pickle
import firebase_admin
import os
from firebase_admin import storage,credentials

if not firebase_admin._apps:
    cred = credentials.Certificate("credentials.json")
    firebase_admin.initialize_app(cred,{"databaseURL" : "https://revahackathon-default-rtdb.asia-southeast1.firebasedatabase.app/",
                                        'storageBucket': "revahackathon.firebasestorage.app" })
bucket = storage.bucket()
blobitties = bucket.list_blobs()
local_folder_path = "C:\\Users\\Prana\\PycharmProjects\\pythonProject2\\Images"
'''
# Downloading each file
for blob in blobitties:
    local_file_path = os.path.join(local_folder_path, blob.name)

    # Creating the directory if it doesn't exist
    os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

    # Downloading the file
    blob.download_to_filename(local_file_path)
    print(f"Downloaded {blob.name} to {local_file_path}")
FamilyID_list = []
FamilyID_list = os.listdir(f'{local_folder_path}\\FamilyMembers')
x = []
ImageList = []
IDs = []
for path in FamilyID_list:
    x = os.listdir(f'{local_folder_path}\\FamilyMembers\\{path}')
    for i in x:
        if "ImageFile" in i:
            ImageList.append(i)
            IDs.append(i.split('.')[0])
'''
ImageList = ['2ImageFile.jpg','3ImageFile.jpg','4ImageFile.jpg']
IDs = ['2','3','4']
#f'{local_folder_path}\\FamilyMembers\\{file[0]}\\{file}'
def Encoding(ImgList):
    listofencodings = []
    for file in ImgList:
        img = cv2.imread(f'{local_folder_path}\\FamilyMembers\\{file[0]}\\{file}')
        if img is None:
            print(f"Warning: Could not load image {file}")
            continue
        img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        encoding = face_recognition.face_encodings(img)[0]
        listofencodings.append(encoding)
    return listofencodings

print("Starting the encoding process")
EncodedListofFam = [Encoding(ImageList),IDs]
print("Encoding process ended")
#print(EncodedListofFam)
'''
file = open("allEncodings.p",'wb')
pickle.dump(EncodedListofFam,file)
file.close()
print("File saved successfully")'''
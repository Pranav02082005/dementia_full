import cv2
import face_recognition
from PICencoding import EncodedListofFam,IDs
import numpy as np
import pickle
import cvzone

def detection():
    cam = cv2.VideoCapture(0)
    cam.set(3,1280)
    cam.set(4,720)
    """
    file = open('allEncodings.p','rb')
    EncodedListofFam = pickle.load(file)
    file.close()"""
    """
    cam = cv2.VideoCapture(0)
    cam.set(3,1280)
    cam.set(4,720)
    
    
    while True:
        success,img = cam.read()
        cv2.imshow("Family Member Recognition", img)
        cv2.waitKey(1)"""


    while True:
        success, img = cam.read()
        encodings,ids = EncodedListofFam
        imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
        imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

        faceCurFrame = face_recognition.face_locations(imgS)
        encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

        if faceCurFrame:
            for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
                matches = face_recognition.compare_faces(encodings, encodeFace)
                faceDis = face_recognition.face_distance(encodings, encodeFace)
                print("matches", matches)
                print("faceDis", faceDis)

                matchIndex = np.argmin(faceDis)
                # print("Match Index", matchIndex)

                if matches[matchIndex]:
                    print("Known Face Detected")
                    print(IDs[matchIndex])
                    y1, x2, y2, x1 = faceLoc
                    y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                    bbox = 55 + x1, 162 + y1, x2 - x1, y2 - y1
                    cv2.putText(img, f"ID: {IDs[matchIndex]}", (x1, y2 + 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0),
                                2)

                cv2.imshow("Family Member Recognition", img)
                cv2.waitKey(1)
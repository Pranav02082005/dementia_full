import firebase_admin
from firebase_admin import credentials,db
from flask import Flask, request, jsonify
from Reminders import create_reminder, update_reminder#,check_reminders
from StoreFamily import upload_image_to_storage,save_user_details,upload_video_to_storage
#from apscheduler.schedulers.background import BackgroundScheduler
from ShowFamily import get_family_member_details,get_file_from_storage
from flask import Response
from datetime import datetime
import cv2
import face_recognition
from PICencoding import EncodedListofFam, IDs
import numpy as np
import google.generativeai as genai
from flask_cors import CORS


# Required Initializations
#scheduler = BackgroundScheduler()
#scheduler.start()
global x
x = 0

if not firebase_admin._apps:
    cred = credentials.Certificate("credentials.json")
    firebase_admin.initialize_app(cred,{"databaseURL" : "https://revahackathon-default-rtdb.asia-southeast1.firebasedatabase.app/",
                                        'storageBucket': "revahackathon.firebasestorage.app" })

#Running
app = Flask(__name__)
CORS(app)  

@app.route('/create_reminder', methods=['POST'])
def create_reminder_route():
    try:
        # Getting form data
        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')
        time = request.form.get('time')

        # Validating data
        if not all([title, date, time]):
            return jsonify({"status": "error", "message": "Missing data"}), 400

        # Creating reminder
        reminder_id = create_reminder(title, description, date, time)

        return jsonify({
            "status": "success",
            "reminder_id": reminder_id
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/update_reminder', methods=['POST'])
def update_reminder_route():
    try:
        # Getting form data
        reminder_id = request.form.get('reminder_id')
        is_completed = request.form.get('is_completed')

        # Validating data
        if not all([reminder_id, is_completed]):
            return jsonify({"status": "error", "message": "Missing data"}), 400

        # Updating reminder
        update_reminder(reminder_id, is_completed == 'true')

        return jsonify({
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_reminder', methods=['GET'])
def get_reminder():
    try:
        # Fetching family member details from Firebase
        reminders_ref = db.reference('reminders')
        reminders = reminders_ref.get()

        if not reminders:
            return jsonify({"status": "error", "message": "No reminders"}), 404

        # Return the details (including photo/video URLs)
        return jsonify({
            "status": "success",
            "data": reminders
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload():
    global x
    x += 1
    try:
        # Getting form data
        FamilyID = x
        name = request.form.get('name')
        relation = request.form.get('relation')
        age = request.form.get('age')
        interest = request.form.get('interest')
        image_file = request.files.get('image')
        video_file = request.files.get('video')

        # Validating data
        if not all([name, relation, age, image_file,interest]):
            return jsonify({"status": "error", "message": "Missing data"}), 400

        # Processing the image and saving user details
        image_url = upload_image_to_storage(image_file,FamilyID)
        video_url = upload_video_to_storage(video_file,FamilyID)
        save_user_details(FamilyID,name, relation, age, interest,image_url,video_url)

        return jsonify({"status": "success", "image_url": image_url,"video_url" : video_url}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_family_details/<FamilyID>', methods=['GET'])
def get_family_details(FamilyID):
    try:
        # Fetching family member details from Firebase
        member_details = get_family_member_details(FamilyID)

        if not member_details:
            return jsonify({"status": "error", "message": "Family member not found"}), 404

        # Return the details (including photo/video URLs)
        print(member_details)
        return jsonify({
            "status": "success",
            "data": member_details
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_file/<FamilyID>/<filename>', methods=['GET'])
def get_file(FamilyID, filename):
    try:
        # Constructing the file path in Firebase Storage
        file_path = f"FamilyMembers/{FamilyID}/{filename}"

        # Fetching the file from Firebase Storage
        file_bytes = get_file_from_storage(file_path)

        if not file_bytes:
            return jsonify({"status": "error", "message": "File not found"}), 404

        # Determining the MIME type based on the file extension
        if filename.endswith('.jpg') or filename.endswith('.jpeg'):
            mime_type = 'image/jpeg'
        elif filename.endswith('.png'):
            mime_type = 'image/png'
        elif filename.endswith('.mp4'):
            mime_type = 'video/mp4'
        else:
            mime_type = 'application/octet-stream'

        # Sending the contents to the user
        return Response(file_bytes, content_type=mime_type)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/post_update/<FamilyID>', methods=['POST'])
def post_update(FamilyID):
    try:
        # Getting the update content from the request
        update_content = request.json.get('update')
        update_date = request.json.get('date')

        if not update_content:
            return jsonify({"status": "error", "message": "Update content is required"}), 400


        # Generating a unique update ID
        update_id = f"update{str(datetime.now().timestamp()).replace('.', '_')}"

        # Saving the update to Firebase Realtime Database
        ref = db.reference(f'updates/{FamilyID}/{update_id}')
        ref.set({
            "update": update_content,
            "date": update_date
        })

        return jsonify({
            "status": "success",
            "message": "Update posted successfully",
            "update_id": update_id
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_updates/<FamilyID>', methods=['GET'])
def get_updates(FamilyID):
    try:
        # Fetching updates from Firebase Realtime Database
        ref = db.reference(f'updates/{FamilyID}')
        updates = ref.get()

        if not updates:
            return jsonify({"status": "error", "message": "No updates found"}), 404

        # Returning the updates
        return jsonify({
            "status": "success",
            "updates": updates
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def send2Front(id):
    try:
        # Fetching family member details from Firebase
        member_details = get_family_member_details(id)

        if not member_details:
            return jsonify({"status": "error", "message": "Family member not found"}), 404
        print(member_details)
        # Return the details (including photo/video URLs)
        return jsonify({
            "status": "success",
            "data": member_details,
            "conversation starter" : get_conversation_starters(member_details['name'],member_details['relation'],
                                                               member_details['interest'])
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/detection', methods=['GET'])
def detection():
    cam = cv2.VideoCapture(0)
    cam.set(3, 1280)
    cam.set(4, 720)

    while True:
        success, img = cam.read()
        encodings, ids = EncodedListofFam
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
                    #bbox = 55 + x1, 162 + y1, x2 - x1, y2 - y1
                    cv2.putText(img, f"ID: {IDs[matchIndex]}", (x1, y2 + 30), cv2.FONT_HERSHEY_SIMPLEX, 1,
                                (0, 255, 0),
                                2)

                cv2.imshow("Family Member Recognition", img)
                cv2.waitKey(3)
                if matches[matchIndex]:
                    cam.release()
                    cv2.destroyAllWindows()
                    return send2Front(IDs[matchIndex])

def convo_using_gemini_api(name,relation,topic):
    # Configure API key
    genai.configure(api_key="AIzaSyATkIjfp2GQy6lc45sYbN66UoZBMTrPBXY")  # Replace with your valid API key

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        f"""Generate a kind, simple conversation starter for someone with dementia. 
    Context: Talking to {name} who is your {relation}. 
    They are interested in {topic}. Make the conversation related to the topic. Do not invent memories or
    information. Keep the conversational cues regular. Give a cue under 30 words. Let it not be awkward. Use their
    name in the conversation to make it more personal. DO NOT GIVE ME OPTIONS. Give a one liner or two liner single
    conversation starter.""")
    print(response.text)
    if(response.text):
        return response.text
    return "No summary available."

# GET endpoint to return conversation starters
#@app.route("/generate-cue/<name>,<relation>,<topic>", methods=["GET"])
def get_conversation_starters(name, relation, topic):
    # Validate input
    if not name or not relation or not topic:
        return "Missing required parameters: name, relation, or topic"

    # Generate conversation starters
    cues = convo_using_gemini_api(name,relation,topic)

    return cues

#scheduler.add_job(check_reminders, 'interval', minutes=1)
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
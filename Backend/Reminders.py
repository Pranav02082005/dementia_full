from firebase_admin import db
from uuid import uuid4
from datetime import datetime
import smtplib
from email.mime.text import MIMEText

def create_reminder(title, description, date, time):
    reminder_id = str(uuid4())  # Generating a unique ReminderID
    
    # Ensure date is in the correct format (YYYY-MM-DD)
    # Check if the date is surrounded by quotes and remove them
    if isinstance(date, str):
        date = date.strip('"\'')
        
    # Validate date format
    try:
        # Attempt to parse the date to ensure it's valid
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        # If it's not a valid date, try to fix it or use today's date
        print(f"Invalid date format: {date}, using today's date instead")
        date = datetime.now().strftime("%Y-%m-%d")
    
    ref = db.reference(f'reminders/{reminder_id}')
    ref.set({
        'title': title,
        'description': description,
        'date': date,  # Store clean date format
        'time': time
    })
    return reminder_id

def update_reminder(reminder_id, is_completed):
    ref = db.reference(f'reminders/{reminder_id}')
    if is_completed:
        ref.delete()

#Checking reminder

def check_reminders():
    try:
        # Getting the current date and time
        now = datetime.now()
        current_date = now.strftime("%Y-%m-%d")

        # Fetching all reminders from the database
        reminders_ref = db.reference('reminders')
        reminders = reminders_ref.get()

        if reminders:
            for reminder in reminders.items():
                print(f'\n{reminder[-1]}\n')
                reminder_date = reminder[-1].get('date')

                # Check if the reminder is due
                if reminder_date == current_date:
                    send_notification(reminder[-1])

    except Exception as e:
        print(f"Error checking reminders: {e}")


#For gmail (It is not working because gmail doesnt allow less secure apps to login)
"""
def send_notification(reminder):
    # Initializing email ids
    sender_email = "pranav.s2805@gmail.com"
    receiver_email = "pranav.sreeharsha@gmail.com"
    password = "Pra^av!5L30@"

    # Creating the email content
    subject = f"Reminder: {reminder['title']}"
    body = f"
    Title: {reminder['title']}
    Description: {reminder['description']}
    Date: {reminder['date']}
    Time: {reminder['time']}
    "

    # Creating the email message
    message = MIMEText(body)
    message['Subject'] = subject
    message['From'] = sender_email
    message['To'] = receiver_email

    # Sending the email
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email notification sent successfully.")
    except Exception as e:
        print(f"Error sending email: {e}")
"""

#For app notifications (Need to write code for getting FCM token)

from firebase_admin import messaging
def send_notification(reminder):
    # Creating a notification message
    message = messaging.Message(
        notification=messaging.Notification(
            title=reminder['title'],
            body=reminder['description'],
        ),
        token="user_device_token", 
    )

    # Sending the message
    try:
        response = messaging.send(message)
        print("Push notification sent successfully:", response)
    except Exception as e:
        print(f"Error sending push notification: {e}")
        

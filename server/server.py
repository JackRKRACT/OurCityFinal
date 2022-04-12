from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from markupsafe import escape
import hashlib
import json
import uuid

# Use a service account
cred = credentials.Certificate('./db_key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# All non-flask functions here
def setCookie(new_user, new_cookie):
  data = {
    'user': new_user,
    'cookie': new_cookie
  }
  db.collection(u'sessions').add(data)
  
def hashInput(input):
  hashed = hashlib.sha256()
  hashed.update(input.encode())
  return hashed.hexdigest()

def validateCookie(data):
  curr_cookie = data.get('cookie').get('this_cookie')
  docs = db.collection(u'sessions').where(u'cookie', u'==', curr_cookie).stream()
  for doc in docs:
    print("Found cookie in DB")
    return True
  return False

def createCookie(user, hashword):
  return uuid.uuid4().hex

# Start defining Flask specific functions
@app.route('/authUser', methods=['POST', 'GET'])
def authUser():
  #name = request.cookies.get('userID')
  data = request.get_json()
  hashword = hashInput(data.get('password'))
  user = data.get('user')

  docs = db.collection(u'accounts').where(u'user', u'==', user).stream()
  for doc in docs:
    dict_doc = doc.to_dict()
    print("Checking DB PW : " + str(dict_doc.get('password')) + " AGAINST " + str(hashword))
    if (dict_doc.get('password') == hashword):
      print("Found user " + str(user))
      new_cookie = createCookie(user, hashword)
      setCookie(user, new_cookie)
      return jsonify(new_cookie)
    print("Invalid login with user " + str(user))
    return "invalid_login"
  print(data)
  print("Invalid login.")
  return "invalid_login"

@app.route('/registerUser', methods=['POST', 'GET'])
def registerUser():
  #name = request.cookies.get('userID')
  data = request.get_json()
  user = data["user"]
  data["password"] = hashInput(data["password"])
  db.collection(u'accounts').add(data)
  print(data)
  return user

@app.route('/validateUser', methods=['POST', 'GET'])
def validateUser():
  # Pass this function a cookie.
  data = request.get_json()
  isValid = validateCookie(data)
  if (isValid):
    return "true"
  return "false"

@app.route('/getApplications', methods=['POST', 'GET'])
def getApplications():
  data = request.get_json()
  if (validateCookie(data)):
    curr_user = data.get('cookie').get('this_user')
    print("Recieved application data request from user : " + curr_user)
    user_apps = db.collection(u'all_pins').document(u'job_postings').collection('job_apps').where(u'cookie.this_user', u'==', curr_user).stream()
    user_apps_arr = []
    for app in user_apps:
      user_apps_arr.append(app.to_dict())
    user_postings = db.collection(u'all_pins').document(u'job_postings').collection('job_pins').where(u'cookie.this_user', u'==', curr_user).stream()
    user_responses_arr = []
    for post in user_postings:
      curr_business = post.to_dict().get('bisn')
      print("Looking for applications under business name : " + curr_business)
      post_responses = db.collection(u'all_pins').document(u'job_postings').collection('job_apps').where(u'bis_name', u'==', curr_business).stream()
      for response in post_responses:
        user_responses_arr.append(response.to_dict())
    
    app_data = {
      'apps': user_apps_arr,
      'responses': user_responses_arr,
    }
    #print(app_data)
    return app_data

@app.route('/updateApplication', methods=['POST'])
def updateApplication():
  data = request.get_json()
  if (validateCookie(data)):
    curr_user = data.get('cookie').get('this_user')
    print("Recieved application update request from user : " + curr_user)
    print(data)
    user_apps = db.collection(u'all_pins').document(u'job_postings').collection('job_apps').where(u'cookie.this_user', u'==', curr_user).stream()
    user_apps_arr = []
    for app in user_apps:
      if (app.to_dict()['bis_id'] == data.get('bis_id')):
        curr_app = db.collection(u'all_pins').document(u'job_postings').collection('job_apps').document(app.id)
        if (data.get('status') == 'canceled'):
          curr_app.delete()
          print("Successfully canceled application")
          return "deleted_app"
        new_data = {
          'status': data.get('status'),
          'description': data.get('description')
        }
        curr_app.update(new_data)
        print("Successfully updated application")
        return new_data
    return data
  return data

@app.route('/getComments', methods=['POST', 'GET'])
def getComments():
  data = request.get_json()
  if (validateCookie(data)):
    # Need to find a comment tree where bisn = what sent.
    comment_sec = db.collection(u'comment_trees').where(u'bisn', u'==', data.get('bisn')).stream()

    for docs in comment_sec:
      print("Found comment section for business " + data.get('bisn'))
      comment_data = db.collection(u'comment_trees').document(data.get('bisn')).collection(u'comments').stream()
      print("Sending comment data")
      new_dict = {}
      for comment in comment_data:
          sub_dic = comment.to_dict()
          sub_dic['id'] = comment.id
          new_dict[comment.id] = sub_dic
      return new_dict
    print("Could not find comment section for " + data.get('bisn'))
    return "empty"
  return "invalid_cookie"

@app.route('/postComment', methods=['POST', 'GET'])
def postComment():
  data = request.get_json()
  if (validateCookie(data)):
    # Need to find a comment tree where bisn = what sent.
    comment_sec = db.collection(u'comment_trees').where(u'bisn', u'==', data.get('bisn')).stream()
    for doc in comment_sec:
      print("Found comment section for business " + data.get('bisn'))
      db.collection(u'comment_trees').document(data.get('bisn')).collection('comments').add(data)
      return data
    # Could not find document tree. Gotta create a new one.
    print("Could not find comment section for " + data.get('bisn'))
    print("Creating new comment section & inserting new comment...")
    db.collection(u'comment_trees').document(data.get('bisn')).collection('comments').add(data)
    db.collection(u'comment_trees').document(data.get('bisn')).set({
      'bisn': data.get('bisn'),
    }, merge=True)
    return data
    #comment_sec.collection("comments").add(data)
  return "invalid_cookie"

@app.route('/submitPosting', methods=['POST', 'GET'])
def submitPosting():
  data = request.get_json()
  if (validateCookie(data)):
      print(data)
      db.collection(u'all_pins').document('job_postings').collection(u'job_pins').add(data)
      return data
  return "invalid_cookie"

@app.route('/submitStudentPin', methods=['POST', 'GET'])
def submitStudentPin():
  data = request.get_json()
  if (validateCookie(data)):
      print(data)
      data.pop('cookie')
      db.collection(u'all_pins').document('student_postings').collection(u'student_pins').add(data)
      return data
  return "invalid_cookie"

@app.route('/submitTourismPin', methods=['POST', 'GET'])
def submitTourismPin():
  data = request.get_json()
  if (validateCookie(data)):
      print(data)
      data.pop('cookie')
      db.collection(u'all_pins').document('tourist_postings').collection(u'tourist_pins').add(data)
      return data
  return "invalid_cookie"

@app.route('/submitApplication', methods=['POST'])
def submitApplication():
  data = request.get_json()
  print(data)
  db.collection(u'all_pins').document('job_postings').collection(u'job_apps').add(data)
  return data

@app.route('/jobListings', methods=['GET'])
def getListings():
  docs = db.collection(u'all_pins').document('job_postings').collection(u'job_pins').stream()
  new_dict = {}
  for doc in docs:
      sub_dic = doc.to_dict()
      sub_dic['id'] = doc.id
      new_dict[doc.id] = sub_dic
  return new_dict

@app.route('/studentListings', methods=['GET'])
def getStudent():
  docs = db.collection(u'all_pins').document('student_postings').collection(u'student_pins').stream()
  new_dict = {}
  for doc in docs:
      sub_dic = doc.to_dict()
      sub_dic['id'] = doc.id
      new_dict[doc.id] = sub_dic
  return new_dict

@app.route('/tourismListings', methods=['GET'])
def tourismListings():
  docs = db.collection(u'all_pins').document('tourist_postings').collection(u'tourist_pins').stream()
  new_dict = {}
  for doc in docs:
      sub_dic = doc.to_dict()
      sub_dic['id'] = doc.id
      new_dict[doc.id] = sub_dic
  return new_dict
  

if __name__ == "__main__":
  app.run(host='127.0.0.1', port=5000, debug=True)
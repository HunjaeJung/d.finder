from flask import Flask, url_for, render_template, request, session
from dropbox.client import DropboxOAuth2Flow, DropboxClient
import os
import json
import dropbox

app = Flask(__name__) 

#go (temp) dropbox folder, get file list
directory = "../all_files/"
changechars = "()&', +@-"
name_before = ""
name_after = ""
contents = ""
json_encode = ""

@app.route('/')
def dfinder():
	return render_template('index.html')

def update_files():
	for root, dirs, files in os.walk(directory):
		for file in files:
			name_before = file
			name_after = file.translate(None,changechars)
			if name_after!=name_before:
				os.rename(directory+name_before,directory+name_after)
				print "File name('"+name_before+"'') is changed to '"+name_after+"'"

			# once at a time, so inefficient
			contents=os.popen("java -jar ./static/lib/tika-app-1.6.jar -t "+directory+name_after).read()
			
			json_encode=os.popen("java -jar ./static/lib/tika-app-1.6.jar -j "+directory+name_after).read()
			json_encode=json.loads(json_encode)
			json_encode['title'] = name_after
			json_encode['text'] = contents

			json_encode=json.dumps(json_encode)
			
			#make each file infomation to json data type for elasticsearch
			os.system("curl -silent -XPOST 'http://localhost:9200/dbx/file/' -d '"+json_encode+"'")



if __name__ == '__main__':
	app.debug = True
	app.run()


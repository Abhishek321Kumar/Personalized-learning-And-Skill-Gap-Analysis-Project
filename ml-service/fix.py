import pymongo
from services.text_extractor import extract_text_from_file

client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
db = client["skillbridge"]

pdf_path = r"C:\Users\Abhishek_Anil\.gemini\antigravity-ide\brain\4bf90252-550d-444f-a671-c74a608ca032\.user_uploaded\media_1788018487602.pdf"
text = extract_text_from_file(pdf_path)

print("Extracted length:", len(text))

db.users.update_many({}, {"$set": {"resumeText": text}})
db.analysissnapshots.delete_many({})

print("Updated users and cleared snapshots!")

from google import genai

client = genai.Client(api_key="AQ.Ab8RN6LrwbIVLKe6cxvtn8QJV7YU2D8iDUTj136HEvHpYi1PKg")

models = client.models.list()
for m in models:
    print(m.name)
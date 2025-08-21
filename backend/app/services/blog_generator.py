
# import os
# import google.generativeai as genai
# from dotenv import load_dotenv

# load_dotenv()
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# def generate_blog(topic: str) -> dict:
#     prompt = f"""
# Write a 600-word SEO-optimized blog on the topic: "{topic}".

# Respond ONLY in this format:

# title: <your catchy blog title>

# content: <full blog written in markdown formatting, including intro, section headers, and conclusion>
# """

#     model = genai.GenerativeModel("gemini-1.5-flash")
#     response = model.generate_content(prompt)
#     text = response.text.strip()

#     # Try to parse structured format
#     parts = text.split("content:")
#     if len(parts) < 2:
#         # Fallback: try to find markdown # title
#         fallback_title = "Untitled"
#         for line in text.split("\n"):
#             if line.strip().startswith("# "):
#                 fallback_title = line.strip()[2:].strip()
#                 break
#         return {
#             "title": fallback_title,
#             "content": text
#         }

#     return {
#         "title": parts[0].replace("title:", "").strip(),
#         "content": parts[1].strip()
#     }


import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

async def generate_blog(topic: str) -> dict:
    prompt = f"""
Write a 600-word SEO-optimized blog on the topic: "{topic}".

Respond ONLY in this format:

title: <your catchy blog title>

content: <full blog written in markdown formatting, including intro, section headers, and conclusion>
"""
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = await model.generate_content_async(prompt)  # async method
    text = response.text.strip()

    parts = text.split("content:")
    if len(parts) < 2:
        fallback_title = "Untitled"
        for line in text.split("\n"):
            if line.strip().startswith("# "):
                fallback_title = line.strip()[2:].strip()
                break
        return {"title": fallback_title, "content": text}

    return {
        "title": parts[0].replace("title:", "").strip(),
        "content": parts[1].strip()
    }

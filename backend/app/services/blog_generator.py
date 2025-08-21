import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
import re

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

genai.configure(api_key=api_key)

async def generate_blog(topic: str) -> dict:
    """
    Generate a blog post using Google's Gemini AI model.
    
    Args:
        topic (str): The topic for the blog post
        
    Returns:
        dict: Dictionary containing 'title' and 'content' keys
        
    Raises:
        Exception: If blog generation fails
    """
    if not topic or not topic.strip():
        raise ValueError("Topic cannot be empty")
    
    prompt = f"""
Write a comprehensive 600-word SEO-optimized blog post on the topic: "{topic.strip()}".

Requirements:
- Create a catchy, SEO-friendly title
- Write engaging content with proper markdown formatting
- Include an introduction, main sections with headers, and conclusion
- Use bullet points or numbered lists where appropriate
- Make it informative and well-structured

Respond EXACTLY in this format:

TITLE: [Your catchy blog title here]

CONTENT:
[Full blog content in markdown format starting here]
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Use run_in_executor for synchronous generate_content
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, model.generate_content, prompt)
        
        if not response or not response.text:
            raise Exception("Empty response from AI model")
        
        text = response.text.strip()
        
        # Parse the response more robustly
        title, content = parse_blog_response(text, topic)
        
        return {
            "title": title,
            "content": content
        }
        
    except Exception as e:
        print(f"❌ Error in generate_blog: {str(e)}")
        # Return a fallback blog instead of failing completely
        return create_fallback_blog(topic)

def parse_blog_response(text: str, topic: str) -> tuple[str, str]:
    """
    Parse the AI response to extract title and content.
    
    Args:
        text (str): Raw AI response
        topic (str): Original topic for fallback
        
    Returns:
        tuple: (title, content)
    """
    try:
        # Try to find title using different patterns
        title_patterns = [
            r'TITLE:\s*(.+?)(?:\n|CONTENT:)',
            r'title:\s*(.+?)(?:\n|content:)',
            r'Title:\s*(.+?)(?:\n|Content:)',
            r'^(.+?)(?:\n|\r\n)',  # First line as title
        ]
        
        title = None
        for pattern in title_patterns:
            match = re.search(pattern, text, re.MULTILINE | re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                if title and len(title) > 5:  # Reasonable title length
                    break
        
        # Try to find content
        content_patterns = [
            r'CONTENT:\s*(.+)',
            r'content:\s*(.+)',
            r'Content:\s*(.+)',
        ]
        
        content = None
        for pattern in content_patterns:
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            if match:
                content = match.group(1).strip()
                break
        
        # If no content found with patterns, use the whole text
        if not content:
            # Remove the title from the text if we found one
            if title:
                content = text.replace(f"TITLE: {title}", "").replace(f"title: {title}", "").strip()
                content = re.sub(r'^CONTENT:\s*', '', content, flags=re.IGNORECASE)
            else:
                content = text
        
        # Fallback title if none found
        if not title:
            # Try to extract first markdown header
            header_match = re.search(r'^#+\s*(.+)', content, re.MULTILINE)
            if header_match:
                title = header_match.group(1).strip()
            else:
                title = f"Complete Guide to {topic.title()}"
        
        # Clean up title (remove markdown, extra spaces)
        title = re.sub(r'^#+\s*', '', title).strip()
        title = re.sub(r'\*\*(.+?)\*\*', r'\1', title)  # Remove bold markdown
        
        # Ensure minimum content length
        if len(content.strip()) < 100:
            raise ValueError("Generated content too short")
        
        return title, content
        
    except Exception as e:
        print(f"❌ Error parsing blog response: {str(e)}")
        raise Exception(f"Failed to parse AI response: {str(e)}")

def create_fallback_blog(topic: str) -> dict:
    """
    Create a fallback blog when AI generation fails.
    
    Args:
        topic (str): The topic for the blog
        
    Returns:
        dict: Dictionary with title and content
    """
    title = f"Understanding {topic.title()}: A Comprehensive Guide"
    
    content = f"""# {title}

## Introduction

{topic} is an important subject that deserves our attention and understanding. In this comprehensive guide, we'll explore various aspects of {topic} and provide valuable insights.

## Key Points About {topic}

- **Relevance**: {topic} plays a significant role in today's world
- **Impact**: Understanding {topic} can provide numerous benefits
- **Applications**: {topic} has wide-ranging applications across different fields

## Why {topic} Matters

{topic} is increasingly becoming relevant in our modern society. Here are some reasons why you should care about {topic}:

1. **Educational Value**: Learning about {topic} expands your knowledge base
2. **Practical Applications**: {topic} has real-world uses and benefits
3. **Future Trends**: {topic} is likely to become more important over time

## Getting Started with {topic}

If you're new to {topic}, here are some steps to begin your journey:

### Step 1: Research and Learn
Start by gathering information about {topic} from reliable sources. This foundation will help you understand the basics.

### Step 2: Practice and Apply
Once you have a basic understanding, try to apply your knowledge in practical situations.

### Step 3: Stay Updated
{topic} is constantly evolving, so it's important to stay informed about the latest developments.

## Common Misconceptions About {topic}

Many people have misconceptions about {topic}. It's important to:
- Verify information from credible sources
- Avoid making assumptions without proper research
- Keep an open mind when learning about {topic}

## Conclusion

{topic} is a fascinating subject with many layers to explore. By taking the time to understand {topic}, you're investing in your personal and professional growth. Whether you're a beginner or looking to deepen your knowledge, there's always more to learn about {topic}.

Remember, mastery of any subject, including {topic}, takes time and practice. Be patient with yourself and enjoy the learning process.
"""
    
    return {
        "title": title,
        "content": content
    }
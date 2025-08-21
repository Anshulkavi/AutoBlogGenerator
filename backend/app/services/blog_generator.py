# app/services/blog_generator.py
import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Configure Google AI
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    logger.error("❌ GOOGLE_API_KEY not found in environment variables")
    raise ValueError("GOOGLE_API_KEY environment variable is required")

logger.info("✅ Configuring Google AI with API key")
genai.configure(api_key=api_key)

async def generate_blog(topic: str) -> dict:
    """
    Generate a blog post using Google's Gemini AI.
    
    Args:
        topic (str): The topic for the blog post
        
    Returns:
        dict: Dictionary containing 'title' and 'content'
    """
    logger.info(f"🤖 Starting blog generation for: '{topic}'")
    
    if not topic or not topic.strip():
        raise ValueError("Topic cannot be empty")
    
    topic = topic.strip()
    
    # Create a comprehensive prompt
    prompt = f"""Write a detailed, engaging blog post about "{topic}".

Requirements:
- Write 500-700 words
- Create an SEO-friendly title (under 60 characters)
- Use proper markdown formatting with headers and bullet points
- Include practical tips and actionable advice
- Make it informative and engaging for readers

Format your response EXACTLY like this:

TITLE: Your Blog Title Here

CONTENT:
# Your Blog Title Here

## Introduction
[Write an engaging introduction paragraph]

## Main Content
[Write the main content with subheadings, bullet points, and detailed information]

## Conclusion
[Write a strong conclusion paragraph]
"""

    try:
        logger.info("🔗 Initializing Gemini model...")
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        logger.info("⏳ Generating content...")
        
        # Generate content synchronously in thread pool
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: model.generate_content(prompt)
        )
        
        logger.info("✅ AI response received")
        
        # Validate response
        if not response or not hasattr(response, 'text') or not response.text:
            logger.error("❌ Empty or invalid response from AI")
            raise Exception("AI returned empty response")
        
        text = response.text.strip()
        logger.info(f"📝 Response length: {len(text)} characters")
        
        # Parse the response
        title, content = parse_ai_response(text, topic)
        
        result = {
            "title": title,
            "content": content
        }
        
        logger.info(f"✅ Blog generated successfully: '{title[:50]}...'")
        return result
        
    except Exception as e:
        logger.error(f"❌ Error in generate_blog: {str(e)}")
        logger.error(f"❌ Traceback: {traceback.format_exc()}")
        
        # Return fallback blog instead of raising exception
        logger.info("🔄 Creating fallback blog...")
        return create_fallback_blog(topic)

def parse_ai_response(text: str, topic: str) -> tuple[str, str]:
    """Parse AI response to extract title and content."""
    logger.info("🔍 Parsing AI response...")
    
    try:
        # Look for title
        title = None
        content = None
        
        # Try different title patterns
        import re
        
        title_match = re.search(r'TITLE:\s*(.+?)(?:\n|$)', text, re.IGNORECASE)
        if title_match:
            title = title_match.group(1).strip()
            logger.info(f"✅ Found title: '{title}'")
        
        # Try to find content after TITLE: or CONTENT:
        content_match = re.search(r'CONTENT:\s*(.+)', text, re.DOTALL | re.IGNORECASE)
        if content_match:
            content = content_match.group(1).strip()
        else:
            # If no CONTENT: marker, use everything after the title
            if title:
                content = text.replace(f"TITLE: {title}", "").strip()
                content = re.sub(r'^CONTENT:\s*', '', content, flags=re.IGNORECASE | re.MULTILINE)
            else:
                content = text
        
        # Clean up and validate
        if not title:
            # Extract first line or create fallback
            first_line = text.split('\n')[0].strip()
            title = first_line if first_line and len(first_line) < 100 else f"Complete Guide to {topic.title()}"
        
        # Remove title from content if it appears at the beginning
        if content.startswith(title):
            content = content[len(title):].strip()
        
        # Ensure minimum content length
        if len(content) < 100:
            logger.warning("⚠️ Content too short, using full response")
            content = text
        
        # Clean up title
        title = re.sub(r'^#+\s*', '', title).strip()
        title = title[:100]  # Limit length
        
        logger.info(f"✅ Parsed successfully - Title: '{title}', Content: {len(content)} chars")
        return title, content
        
    except Exception as e:
        logger.error(f"❌ Error parsing response: {str(e)}")
        raise Exception(f"Failed to parse AI response: {str(e)}")

def create_fallback_blog(topic: str) -> dict:
    """Create a fallback blog when AI generation fails."""
    logger.info(f"🔄 Creating fallback blog for: '{topic}'")
    
    title = f"Understanding {topic.title()}: A Comprehensive Guide"
    
    content = f"""# {title}

## Introduction

Welcome to this comprehensive guide about {topic}. This topic is increasingly important in today's world, and understanding it can provide valuable insights and practical benefits.

## What You Need to Know About {topic}

{topic} encompasses several key concepts that are worth exploring:

### Key Benefits
- **Educational Value**: Learning about {topic} expands your knowledge
- **Practical Applications**: {topic} has real-world uses
- **Future Relevance**: Understanding {topic} prepares you for future trends

### Getting Started
- Research the basics from reliable sources
- Look for practical examples and case studies
- Connect with communities interested in {topic}

## Practical Tips for {topic}

Here are some actionable tips to help you get started:

1. **Start with the fundamentals** - Build a solid foundation
2. **Practice regularly** - Apply what you learn in real situations
3. **Stay updated** - Follow developments and new trends
4. **Join communities** - Connect with others who share your interest

## Common Questions

**Q: Why is {topic} important?**
A: {topic} is relevant because it affects many aspects of our daily lives and future development.

**Q: How can I learn more about {topic}?**
A: Start with reputable sources, take online courses, and engage with expert content.

## Conclusion

{topic} represents an exciting area for exploration and learning. Whether you're just beginning or looking to deepen your understanding, taking the time to learn about {topic} is a valuable investment.

Remember that mastering any subject takes time and practice. Be patient with yourself and enjoy the learning journey as you discover more about {topic}.
"""
    
    return {
        "title": title,
        "content": content
    }
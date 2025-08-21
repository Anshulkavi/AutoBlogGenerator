import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
import re
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Validate API key
if not api_key:
    logger.error("❌ GOOGLE_API_KEY environment variable is not set")
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

logger.info("✅ Google API key found, configuring Gemini...")
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
    logger.info(f"🤖 Starting blog generation for topic: '{topic}'")
    
    if not topic or not topic.strip():
        logger.error("❌ Empty topic provided to generate_blog")
        raise ValueError("Topic cannot be empty")
    
    topic = topic.strip()
    
    prompt = f"""
Write a comprehensive 600-800 word SEO-optimized blog post about: "{topic}"

Requirements:
- Create a catchy, SEO-friendly title (no more than 60 characters)
- Write engaging content with proper markdown formatting
- Include an introduction, main sections with headers, and conclusion
- Use bullet points or numbered lists where appropriate
- Make it informative, well-structured, and engaging for readers

IMPORTANT: Respond EXACTLY in this format with no extra text:

TITLE: [Your catchy blog title here]

CONTENT:
[Full blog content in markdown format starting here - include headers, bullet points, etc.]
"""

    try:
        logger.info("🔗 Initializing Gemini model...")
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        logger.info("⏳ Generating content with AI...")
        
        # Use run_in_executor for synchronous generate_content
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, model.generate_content, prompt)
        
        logger.info("✅ AI response received")
        
        if not response:
            logger.error("❌ Empty response from AI model")
            raise Exception("Empty response from AI model")
        
        if not hasattr(response, 'text') or not response.text:
            logger.error("❌ AI response missing text content")
            raise Exception("AI response missing text content")
        
        text = response.text.strip()
        logger.info(f"📝 AI response length: {len(text)} characters")
        logger.info(f"📝 AI response preview: {text[:200]}...")
        
        # Parse the response
        logger.info("🔍 Parsing AI response...")
        title, content = parse_blog_response(text, topic)
        
        logger.info(f"✅ Successfully parsed - Title: '{title[:50]}...', Content length: {len(content)}")
        
        return {
            "title": title,
            "content": content
        }
        
    except Exception as e:
        logger.error(f"❌ Error in generate_blog: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        
        # Return a fallback blog instead of failing completely
        logger.info("🔄 Generating fallback blog...")
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
    logger.info("🔍 Starting response parsing...")
    
    try:
        # Clean up the text
        text = text.strip()
        
        # Try to find title using different patterns
        title_patterns = [
            r'TITLE:\s*(.+?)(?:\n|CONTENT:)',
            r'title:\s*(.+?)(?:\n|content:)',
            r'Title:\s*(.+?)(?:\n|Content:)',
        ]
        
        title = None
        for i, pattern in enumerate(title_patterns):
            match = re.search(pattern, text, re.MULTILINE | re.IGNORECASE | re.DOTALL)
            if match:
                title = match.group(1).strip()
                logger.info(f"✅ Found title using pattern {i+1}: '{title[:50]}...'")
                break
        
        # Try to find content
        content_patterns = [
            r'CONTENT:\s*(.+)',
            r'content:\s*(.+)',
            r'Content:\s*(.+)',
        ]
        
        content = None
        for i, pattern in enumerate(content_patterns):
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            if match:
                content = match.group(1).strip()
                logger.info(f"✅ Found content using pattern {i+1}, length: {len(content)}")
                break
        
        # If patterns didn't work, try a different approach
        if not title or not content:
            logger.info("🔄 Primary patterns failed, trying alternative parsing...")
            lines = text.split('\n')
            
            # Look for title in first few lines
            if not title:
                for line in lines[:5]:
                    line = line.strip()
                    if line and not line.lower().startswith(('content', 'title')):
                        # Remove markdown formatting
                        clean_line = re.sub(r'^#+\s*', '', line).strip()
                        clean_line = re.sub(r'\*\*(.+?)\*\*', r'\1', clean_line)
                        if len(clean_line) > 5 and len(clean_line) < 100:
                            title = clean_line
                            logger.info(f"✅ Extracted title from lines: '{title}'")
                            break
            
            # Use remaining text as content
            if not content:
                # Find where content starts
                content_start_idx = 0
                for i, line in enumerate(lines):
                    if title and title.lower() in line.lower():
                        content_start_idx = i + 1
                        break
                    elif re.search(r'content:', line, re.IGNORECASE):
                        content_start_idx = i + 1
                        break
                
                content = '\n'.join(lines[content_start_idx:]).strip()
                logger.info(f"✅ Extracted content from remaining lines, length: {len(content)}")
        
        # Final fallbacks
        if not title:
            title = f"Complete Guide to {topic.title()}"
            logger.info(f"🔄 Using fallback title: '{title}'")
        
        if not content or len(content.strip()) < 100:
            logger.warning("⚠️ Content too short or missing, using full response as content")
            content = text
        
        # Clean up title (remove markdown, extra spaces)
        title = re.sub(r'^#+\s*', '', title).strip()
        title = re.sub(r'\*\*(.+?)\*\*', r'\1', title)
        title = title[:100]  # Limit title length
        
        # Ensure minimum content length
        if len(content.strip()) < 100:
            raise ValueError("Generated content too short")
        
        logger.info(f"✅ Parsing completed - Title: '{title}', Content length: {len(content)}")
        return title, content
        
    except Exception as e:
        logger.error(f"❌ Error parsing blog response: {str(e)}")
        logger.error(f"❌ Full traceback: {traceback.format_exc()}")
        raise Exception(f"Failed to parse AI response: {str(e)}")

def create_fallback_blog(topic: str) -> dict:
    """
    Create a fallback blog when AI generation fails.
    
    Args:
        topic (str): The topic for the blog
        
    Returns:
        dict: Dictionary with title and content
    """
    logger.info(f"🔄 Creating fallback blog for topic: '{topic}'")
    
    title = f"Understanding {topic.title()}: A Comprehensive Guide"
    
    content = f"""# {title}

## Introduction

{topic} is an important subject that deserves our attention and understanding. In this comprehensive guide, we'll explore various aspects of {topic} and provide valuable insights to help you better understand this topic.

## What is {topic}?

{topic} encompasses various elements that are crucial in today's rapidly evolving world. Understanding the fundamentals of {topic} can provide numerous benefits and open up new opportunities for learning and growth.

## Key Aspects of {topic}

### 1. Foundation and Basics
- **Core Concepts**: The fundamental principles that define {topic}
- **Historical Context**: How {topic} has evolved over time
- **Current Relevance**: Why {topic} matters in today's context

### 2. Practical Applications
- **Real-world Uses**: How {topic} is applied in various industries
- **Benefits**: The advantages of understanding and implementing {topic}
- **Challenges**: Common obstacles and how to overcome them

### 3. Future Perspectives
- **Emerging Trends**: What's new and exciting in the field of {topic}
- **Opportunities**: Areas where {topic} shows promising potential
- **Innovation**: How {topic} continues to evolve and adapt

## Why {topic} Matters

Understanding {topic} is increasingly important because:

1. **Educational Value**: It expands your knowledge and critical thinking skills
2. **Professional Growth**: Knowledge of {topic} can enhance career prospects
3. **Personal Development**: It contributes to a well-rounded understanding of the world
4. **Future Preparedness**: Staying informed helps you adapt to changes

## Getting Started with {topic}

If you're new to {topic}, here's a roadmap to begin your learning journey:

### Step 1: Research and Foundation
- Start with reliable sources and basic materials
- Build a solid understanding of core concepts
- Take notes and organize your learning

### Step 2: Practical Exploration
- Look for real-world examples and case studies
- Try to apply concepts in relevant situations
- Connect with others who share your interest

### Step 3: Continuous Learning
- Stay updated with latest developments
- Join communities or forums related to {topic}
- Practice and refine your understanding regularly

## Common Questions About {topic}

**Q: How long does it take to understand {topic}?**
A: The learning timeline varies depending on your background and the depth you want to achieve. Start with basics and gradually build your knowledge.

**Q: What resources are best for learning about {topic}?**
A: Look for reputable books, online courses, research papers, and expert blogs. Hands-on experience is also valuable.

**Q: Is {topic} relevant for everyone?**
A: While not everyone needs deep expertise, a basic understanding of {topic} can be beneficial in our interconnected world.

## Conclusion

{topic} represents an exciting area of knowledge with wide-ranging implications. Whether you're just starting your journey or looking to deepen your understanding, remember that learning is a continuous process.

The key to mastering {topic} lies in consistent effort, staying curious, and remaining open to new ideas. As you continue to explore this subject, you'll discover new connections and applications that make the learning experience even more rewarding.

Take the first step today, and begin your journey toward understanding {topic}. The knowledge you gain will serve you well in many aspects of life and work.
"""
    
    logger.info(f"✅ Fallback blog created - Title: '{title}', Content length: {len(content)}")
    
    return {
        "title": title,
        "content": content
    }
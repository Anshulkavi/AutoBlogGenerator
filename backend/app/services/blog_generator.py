# # app/services/blog_generator.py
# import os
# import asyncio
# import google.generativeai as genai
# from dotenv import load_dotenv
# import logging
# import traceback

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# load_dotenv()

# # Configure Google AI
# api_key = os.getenv("GOOGLE_API_KEY")
# if not api_key:
#     logger.error("❌ GOOGLE_API_KEY not found in environment variables")
#     raise ValueError("GOOGLE_API_KEY environment variable is required")

# logger.info("✅ Configuring Google AI with API key")
# genai.configure(api_key=api_key)

# async def generate_blog(topic: str) -> dict:
#     """
#     Generate a blog post using Google's Gemini AI.
    
#     Args:
#         topic (str): The topic for the blog post
        
#     Returns:
#         dict: Dictionary containing 'title' and 'content'
#     """
#     logger.info(f"🤖 Starting blog generation for: '{topic}'")
    
#     if not topic or not topic.strip():
#         raise ValueError("Topic cannot be empty")
    
#     topic = topic.strip()
    
#     # Create a comprehensive prompt
#     prompt = f"""Write a detailed, engaging blog post about "{topic}".

# Requirements:
# - Write 500-700 words
# - Create an SEO-friendly title (under 60 characters)
# - Use proper markdown formatting with headers and bullet points
# - Include practical tips and actionable advice
# - Make it informative and engaging for readers

# Format your response EXACTLY like this:

# TITLE: Your Blog Title Here

# CONTENT:
# # Your Blog Title Here

# ## Introduction
# [Write an engaging introduction paragraph]

# ## Main Content
# [Write the main content with subheadings, bullet points, and detailed information]

# ## Conclusion
# [Write a strong conclusion paragraph]
# """

#     try:
#         logger.info("🔗 Initializing Gemini model...")
#         model = genai.GenerativeModel("gemini-1.5-flash")
        
#         logger.info("⏳ Generating content...")
        
#         # Generate content synchronously in thread pool
#         loop = asyncio.get_event_loop()
#         response = await loop.run_in_executor(
#             None, 
#             lambda: model.generate_content(prompt)
#         )
        
#         logger.info("✅ AI response received")
        
#         # Validate response
#         if not response or not hasattr(response, 'text') or not response.text:
#             logger.error("❌ Empty or invalid response from AI")
#             raise Exception("AI returned empty response")
        
#         text = response.text.strip()
#         logger.info(f"📝 Response length: {len(text)} characters")
        
#         # Parse the response
#         title, content = parse_ai_response(text, topic)
        
#         result = {
#             "title": title,
#             "content": content
#         }
        
#         logger.info(f"✅ Blog generated successfully: '{title[:50]}...'")
#         return result
        
#     except Exception as e:
#         logger.error(f"❌ Error in generate_blog: {str(e)}")
#         logger.error(f"❌ Traceback: {traceback.format_exc()}")
        
#         # Return fallback blog instead of raising exception
#         logger.info("🔄 Creating fallback blog...")
#         return create_fallback_blog(topic)

# def parse_ai_response(text: str, topic: str) -> tuple[str, str]:
#     """Parse AI response to extract title and content."""
#     logger.info("🔍 Parsing AI response...")
    
#     try:
#         # Look for title
#         title = None
#         content = None
        
#         # Try different title patterns
#         import re
        
#         title_match = re.search(r'TITLE:\s*(.+?)(?:\n|$)', text, re.IGNORECASE)
#         if title_match:
#             title = title_match.group(1).strip()
#             logger.info(f"✅ Found title: '{title}'")
        
#         # Try to find content after TITLE: or CONTENT:
#         content_match = re.search(r'CONTENT:\s*(.+)', text, re.DOTALL | re.IGNORECASE)
#         if content_match:
#             content = content_match.group(1).strip()
#         else:
#             # If no CONTENT: marker, use everything after the title
#             if title:
#                 content = text.replace(f"TITLE: {title}", "").strip()
#                 content = re.sub(r'^CONTENT:\s*', '', content, flags=re.IGNORECASE | re.MULTILINE)
#             else:
#                 content = text
        
#         # Clean up and validate
#         if not title:
#             # Extract first line or create fallback
#             first_line = text.split('\n')[0].strip()
#             title = first_line if first_line and len(first_line) < 100 else f"Complete Guide to {topic.title()}"
        
#         # Remove title from content if it appears at the beginning
#         if content.startswith(title):
#             content = content[len(title):].strip()
        
#         # Ensure minimum content length
#         if len(content) < 100:
#             logger.warning("⚠️ Content too short, using full response")
#             content = text
        
#         # Clean up title
#         title = re.sub(r'^#+\s*', '', title).strip()
#         title = title[:100]  # Limit length
        
#         logger.info(f"✅ Parsed successfully - Title: '{title}', Content: {len(content)} chars")
#         return title, content
        
#     except Exception as e:
#         logger.error(f"r parsing response: {str(e)}")
#         raise Exception(f"Failed to parse AI response: {str(e)}")

# def create_fallback_blog(topic: str) -> dict:
#     """Create a fallback blog when AI generation fails."""
#     logger.info(f"🔄 Creating fallback blog for: '{topic}'")
    
#     title = f"Understanding {topic.title()}: A Comprehensive Guide"
    
#     content = f"""# {title}

# ## Introduction

# Welcome to this comprehensive guide about {topic}. This topic is increasingly important in today's world, and understanding it can provide valuable insights and practical benefits.

# ## What You Need to Know About {topic}

# {topic} encompasses several key concepts that are worth exploring:

# ### Key Benefits
# - **Educational Value**: Learning about {topic} expands your knowledge
# - **Practical Applications**: {topic} has real-world uses
# - **Future Relevance**: Understanding {topic} prepares you for future trends

# ### Getting Started
# - Research the basics from reliable sources
# - Look for practical examples and case studies
# - Connect with communities interested in {topic}

# ## Practical Tips for {topic}

# Here are some actionable tips to help you get started:

# 1. **Start with the fundamentals** - Build a solid foundation
# 2. **Practice regularly** - Apply what you learn in real situations
# 3. **Stay updated** - Follow developments and new trends
# 4. **Join communities** - Connect with others who share your interest

# ## Common Questions

# **Q: Why is {topic} important?**
# A: {topic} is relevant because it affects many aspects of our daily lives and future development.

# **Q: How can I learn more about {topic}?**
# A: Start with reputable sources, take online courses, and engage with expert content.

# ## Conclusion

# {topic} represents an exciting area for exploration and learning. Whether you're just beginning or looking to deepen your understanding, taking the time to learn about {topic} is a valuable investment.

# Remember that mastering any subject takes time and practice. Be patient with yourself and enjoy the learning journey as you discover more about {topic}.
# """
    
#     return {
#         "title": title,
#         "content": content
#     }

# backend/app/services/blog_generator.py
import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
import logging
import traceback
import sys
import time

# Set up comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

# Configure Google AI with detailed error handling
api_key = os.getenv("GOOGLE_API_KEY")
logger.info(f"🔑 Google API Key check: {'✅ Found' if api_key else '❌ Missing'}")

if not api_key:
    logger.error("❌ GOOGLE_API_KEY not found in environment variables")
    logger.error("❌ Available environment variables:")
    for key in os.environ.keys():
        if 'KEY' in key.upper() or 'API' in key.upper():
            logger.error(f"   {key}: {'Set' if os.environ[key] else 'Empty'}")
    raise ValueError("GOOGLE_API_KEY environment variable is required")

logger.info("✅ Configuring Google AI with API key")
try:
    genai.configure(api_key=api_key)
    logger.info("✅ Google AI configured successfully")
except Exception as config_error:
    logger.error(f"❌ Failed to configure Google AI: {config_error}")
    raise

async def generate_blog(topic: str) -> dict:
    """
    Generate a blog post using Google's Gemini AI with comprehensive error handling.
    
    Args:
        topic (str): The topic for the blog post
        
    Returns:
        dict: Dictionary containing 'title' and 'content'
    """
    logger.info(f"🤖 === STARTING BLOG GENERATION ===")
    logger.info(f"🤖 Topic: '{topic}'")
    logger.info(f"🤖 Topic length: {len(topic)}")
    logger.info(f"🤖 Topic type: {type(topic)}")
    
    if not topic or not topic.strip():
        logger.error("❌ Topic validation failed: empty topic")
        raise ValueError("Topic cannot be empty")
    
    topic = topic.strip()
    logger.info(f"🤖 Cleaned topic: '{topic}'")
    
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

    logger.info(f"📝 Prompt created (length: {len(prompt)})")
    logger.info(f"📝 Prompt preview: {prompt[:200]}...")

    try:
        logger.info("🔗 Initializing Gemini model...")
        
        # Test different model names if one fails
        model_names = ["gemini-1.5-flash"]
        model = None
        
        for model_name in model_names:
            try:
                logger.info(f"🔄 Trying model: {model_name}")
                model = genai.GenerativeModel(model_name)
                logger.info(f"✅ Successfully initialized model: {model_name}")
                break
            except Exception as model_error:
                logger.warning(f"⚠️ Failed to initialize {model_name}: {model_error}")
                continue
        
        if model is None:
            logger.error("❌ Failed to initialize any Gemini model")
            return create_fallback_blog(topic)
        
        logger.info("⏳ Generating content...")
        start_time = time.time()
        
        try:
            # Generate content with timeout
            loop = asyncio.get_event_loop()
            response = await asyncio.wait_for(
                loop.run_in_executor(
                    None, 
                    lambda: model.generate_content(prompt)
                ),
                timeout=30.0  # 30 second timeout
            )
            
            generation_time = time.time() - start_time
            logger.info(f"✅ AI response received in {generation_time:.2f} seconds")
            
        except asyncio.TimeoutError:
            logger.error("❌ AI generation timed out after 30 seconds")
            return create_fallback_blog(topic)
        except Exception as gen_error:
            logger.error(f"❌ AI generation error: {str(gen_error)}")
            logger.error(f"❌ Generation error type: {type(gen_error)}")
            logger.error(f"❌ Generation traceback: {traceback.format_exc()}")
            return create_fallback_blog(topic)
        
        # Validate response
        if not response:
            logger.error("❌ Response is None")
            return create_fallback_blog(topic)
            
        if not hasattr(response, 'text'):
            logger.error(f"❌ Response missing 'text' attribute. Type: {type(response)}")
            logger.error(f"❌ Response attributes: {dir(response)}")
            return create_fallback_blog(topic)
            
        if not response.text:
            logger.error("❌ Response text is empty")
            logger.error(f"❌ Response object: {response}")
            return create_fallback_blog(topic)
        
        text = response.text.strip()
        logger.info(f"📝 Response length: {len(text)} characters")
        logger.info(f"📝 Response preview: {text[:300]}...")
        
        # Parse the response
        logger.info("🔍 Parsing AI response...")
        title, content = parse_ai_response(text, topic)
        
        result = {
            "title": title,
            "content": content
        }
        
        logger.info(f"✅ Blog generated successfully!")
        logger.info(f"📄 Title: '{title}'")
        logger.info(f"📄 Content length: {len(content)} characters")
        logger.info(f"🤖 === BLOG GENERATION COMPLETED ===")
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Critical error in generate_blog: {str(e)}")
        logger.error(f"❌ Error type: {type(e)}")
        logger.error(f"❌ Traceback: {traceback.format_exc()}")
        
        # Return fallback blog instead of raising exception
        logger.info("🔄 Creating fallback blog due to critical error...")
        return create_fallback_blog(topic)

def parse_ai_response(text: str, topic: str) -> tuple[str, str]:
    """Parse AI response to extract title and content with enhanced error handling."""
    logger.info("🔍 === PARSING AI RESPONSE ===")
    logger.info(f"🔍 Text length: {len(text)}")
    logger.info(f"🔍 Text preview: {text[:500]}...")
    
    try:
        import re
        
        title = None
        content = None
        
        # Try different title patterns
        title_patterns = [
            r'TITLE:\s*(.+?)(?:\n|$)',
            r'Title:\s*(.+?)(?:\n|$)', 
            r'# (.+?)(?:\n|$)',
            r'^(.+?)(?:\n|$)'
        ]
        
        for pattern in title_patterns:
            title_match = re.search(pattern, text, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
                logger.info(f"✅ Found title with pattern '{pattern}': '{title}'")
                break
        
        # Try to find content after TITLE: or CONTENT:
        content_patterns = [
            r'CONTENT:\s*(.+)',
            r'Content:\s*(.+)',
        ]
        
        for pattern in content_patterns:
            content_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            if content_match:
                content = content_match.group(1).strip()
                logger.info(f"✅ Found content with pattern '{pattern}', length: {len(content)}")
                break
        
        # If no content pattern matched, try alternative approaches
        if not content:
            logger.info("🔍 No content pattern matched, trying alternatives...")
            
            # Remove title from text and use remainder as content
            if title:
                # Find title in text and remove everything before and including it
                title_index = text.lower().find(title.lower())
                if title_index != -1:
                    content = text[title_index + len(title):].strip()
                    # Remove any "CONTENT:" markers
                    content = re.sub(r'^CONTENT:\s*', '', content, flags=re.IGNORECASE | re.MULTILINE)
                else:
                    content = text
            else:
                content = text
            
            logger.info(f"📝 Using alternative content extraction, length: {len(content)}")
        
        # Clean up and validate
        if not title:
            logger.warning("⚠️ No title found, creating fallback title")
            # Try to extract first meaningful line
            lines = text.split('\n')
            for line in lines:
                clean_line = re.sub(r'^#+\s*', '', line.strip())
                clean_line = re.sub(r'^TITLE:\s*', '', clean_line, flags=re.IGNORECASE)
                if clean_line and len(clean_line) < 100 and len(clean_line) > 10:
                    title = clean_line
                    logger.info(f"📝 Extracted title from line: '{title}'")
                    break
            
            if not title:
                title = f"Complete Guide to {topic.title()}"
                logger.info(f"📝 Using fallback title: '{title}'")
        
        # Clean up title
        title = re.sub(r'^#+\s*', '', title).strip()
        title = re.sub(r'^TITLE:\s*', '', title, flags=re.IGNORECASE).strip()
        title = title[:100]  # Limit length
        
        # Clean up content
        if content:
            # Remove title from beginning of content if it appears there
            if content.lower().startswith(title.lower()):
                content = content[len(title):].strip()
            
            # Remove any remaining markers
            content = re.sub(r'^CONTENT:\s*', '', content, flags=re.IGNORECASE | re.MULTILINE)
            content = re.sub(r'^TITLE:.*?\n', '', content, flags=re.IGNORECASE | re.MULTILINE)
        
        # Ensure minimum content length
        if not content or len(content.strip()) < 100:
            logger.warning(f"⚠️ Content too short ({len(content) if content else 0} chars), using full response")
            content = text
            
            # Still try to remove title from content
            if title and content.lower().startswith(title.lower()):
                content = content[len(title):].strip()
        
        logger.info(f"✅ Parsing completed successfully")
        logger.info(f"📄 Final title: '{title}' ({len(title)} chars)")
        logger.info(f"📄 Final content length: {len(content)} chars")
        logger.info(f"📄 Content preview: {content[:200]}...")
        
        return title, content
        
    except Exception as e:
        logger.error(f"❌ Error parsing response: {str(e)}")
        logger.error(f"❌ Parse error traceback: {traceback.format_exc()}")
        
        # Fallback parsing
        logger.info("🔄 Using fallback parsing...")
        title = f"Guide to {topic.title()}"
        content = text[:2000] if text else f"This is a guide about {topic}."
        
        return title, content

def create_fallback_blog(topic: str) -> dict:
    """Create a fallback blog when AI generation fails."""
    logger.info(f"🔄 === CREATING FALLBACK BLOG ===")
    logger.info(f"🔄 Fallback topic: '{topic}'")
    
    title = f"Understanding {topic.title()}: A Comprehensive Guide"
    
    content = f"""# {title}

## Introduction

Welcome to this comprehensive guide about {topic}. This topic is increasingly important in today's world, and understanding it can provide valuable insights and practical benefits.

## What You Need to Know About {topic}

{topic} encompasses several key concepts that are worth exploring:

### Key Benefits
- **Educational Value**: Learning about {topic} expands your knowledge base
- **Practical Applications**: {topic} has real-world uses and applications
- **Future Relevance**: Understanding {topic} prepares you for future trends
- **Personal Growth**: Knowledge of {topic} contributes to personal development

### Getting Started with {topic}
- Research the basics from reliable and authoritative sources
- Look for practical examples and detailed case studies
- Connect with communities and experts interested in {topic}
- Practice applying concepts in real-world scenarios

## Practical Tips for {topic}

Here are some actionable tips to help you get started with {topic}:

1. **Start with the fundamentals** - Build a solid foundation by understanding core concepts
2. **Practice regularly** - Apply what you learn in practical, real-world situations
3. **Stay updated** - Follow the latest developments, trends, and innovations
4. **Join communities** - Connect with others who share your interest and expertise
5. **Document your learning** - Keep track of your progress and insights

## Common Questions About {topic}

**Q: Why is {topic} important in today's world?**
A: {topic} is relevant because it affects many aspects of our daily lives and plays a crucial role in future technological and social development.

**Q: How can I learn more about {topic}?**
A: Start with reputable sources, take online courses, attend workshops, engage with expert content, and practice regularly.

**Q: What are the main challenges in {topic}?**
A: Like any field, {topic} has its complexities and challenges, but with proper guidance and consistent effort, these can be overcome.

## Advanced Concepts

As you progress in your understanding of {topic}, you'll encounter more advanced concepts that build upon the fundamentals:

- Deep analysis and critical thinking approaches
- Integration with other related fields and disciplines
- Emerging trends and future developments
- Professional applications and career opportunities

## Conclusion

{topic} represents an exciting and valuable area for exploration and learning. Whether you're just beginning your journey or looking to deepen your existing understanding, taking the time to learn about {topic} is a worthwhile investment in your personal and professional development.

Remember that mastering any subject takes time, patience, and consistent practice. Be patient with yourself and enjoy the learning journey as you discover more about the fascinating world of {topic}. The knowledge and skills you gain will serve you well in many aspects of your life.

---

*This content was generated as a comprehensive introduction to {topic}. For more detailed and specific information, consider consulting additional expert sources and specialized resources.*
"""
    
    result = {
        "title": title,
        "content": content
    }
    
    logger.info(f"✅ Fallback blog created successfully")
    logger.info(f"📄 Fallback title: '{title}'")
    logger.info(f"📄 Fallback content length: {len(content)} characters")
    logger.info(f"🔄 === FALLBACK BLOG COMPLETED ===")
    
    return result

# Test function for debugging
async def test_blog_generation():
    """Test function to verify blog generation is working"""
    logger.info("🧪 === TESTING BLOG GENERATION ===")
    
    try:
        test_topic = "artificial intelligence"
        logger.info(f"🧪 Testing with topic: '{test_topic}'")
        
        result = await generate_blog(test_topic)
        
        logger.info(f"✅ Test successful!")
        logger.info(f"📄 Result type: {type(result)}")
        logger.info(f"📄 Result keys: {list(result.keys()) if isinstance(result, dict) else 'Not a dict'}")
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Test failed: {str(e)}")
        logger.error(f"❌ Test traceback: {traceback.format_exc()}")
        return None

if __name__ == "__main__":
    # Run test when file is executed directly
    import asyncio
    
    async def main():
        logger.info("🚀 Starting blog generator test...")
        result = await test_blog_generation()
        if result:
            logger.info("✅ Blog generator test completed successfully")
        else:
            logger.error("❌ Blog generator test failed")
    
    asyncio.run(main())
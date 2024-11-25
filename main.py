from flask import Flask, request, jsonify, redirect
import random
import string

app = Flask(__name__)

# In-memory database to store short codes and original URLs
url_map = {}

# Your domain for shortened URLs
SHORT_DOMAIN = "https://1REC.com"

def generate_short_code():
    """Generate a random 6-character alphanumeric short code."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

@app.route('/shorten', methods=['POST'])
def shorten_url():
    """API endpoint to shorten a URL."""
    original_url = request.json.get('url')
    if not original_url:
        return jsonify({"error": "URL is required"}), 400
    
    # Check if the URL is already shortened
    for short_code, long_url in url_map.items():
        if long_url == original_url:
            return jsonify({"short_url": f"{SHORT_DOMAIN}/{short_code}"})
    
    # Generate a unique short code
    short_code = generate_short_code()
    while short_code in url_map:
        short_code = generate_short_code()
    
    # Store the mapping in the database
    url_map[short_code] = original_url
    return jsonify({"short_url": f"{SHORT_DOMAIN}/{short_code}"})

@app.route('/<short_code>', methods=['GET'])
def redirect_to_original(short_code):
    """Redirect the short URL to the original URL."""
    original_url = url_map.get(short_code)
    if not original_url:
        return jsonify({"error": "URL not found"}), 404
    return redirect(original_url)

@app.route('/list', methods=['GET'])
def list_shortened_urls():
    """List all shortened URLs (for debugging purposes)."""
    return jsonify(url_map)

if __name__ == '__main__':
    app.run(debug=True)

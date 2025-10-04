import os
from flask import Flask, render_template, request, url_for, redirect, Blueprint, session, send_from_directory

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = 'your_secret_key_here'

# Updated supported languages (only requested ones)
SUPPORTED_LANGS = ['fr', 'en', 'de', 'es', 'it', 'pt', 'pl']

# List of pages that are not localized and should redirect to English
UNTRANSLATED_PAGES = [
    'blogs',
    'how-to-convert-cl-to-g',
    'what-is-cl-to-g',
    'density-guide',
    'contact',
    'about-us',
    'privacy-policy',
    'terms-conditions'
]

# --- Helper: Get correct template name ---
def get_template_name(base_path, lang_code):
    """Return correct template path based on lang code. 'en' uses _eng suffix."""
    if lang_code == 'en':
        return f'{base_path}_eng.html'
    return f'{base_path}_{lang_code}.html'

# --- Blueprints ---
lang_routes = Blueprint('lang_routes', __name__, url_prefix='/<lang_code>')

# --- Trailing Slash Handling ---
@app.before_request
def handle_trailing_slash():
    if request.path != '/' and request.path.endswith('/'):
        return redirect(request.path[:-1], code=301)

# --- ROOT PATH (Now shows French home page by default) ---
@app.route('/', strict_slashes=False)
def home():
    session['lang_code'] = 'fr'  # Changed to French as default
    return render_page('fr', 'home')

# --- EXPLICIT TOOL ROUTES (Root Level) ---
@app.route('/cl-to-g', strict_slashes=False)
def cl_to_g():
    return render_page('en', 'cl-to-g')  # Default to English for tools

@app.route('/g-to-cl', strict_slashes=False)
def g_to_cl():
    return render_page('en', 'g-to-cl')

@app.route('/l-to-kg', strict_slashes=False)
def l_to_kg():
    return render_page('en', 'l-to-kg')

# --- ALL OTHER ENGLISH PAGES ---
@app.route('/<page>', strict_slashes=False)
def default_pages(page):
    session['lang_code'] = 'en'

    # Handle blogs
    if page == 'blogs':
        return render_template(get_template_name('blogs/blog_index', 'en'), lang_code='en', current_page_name='blogs')

    blog_slugs = {
        'how-to-convert-cl-to-g': 'blogs/how-to-convert-cl-to-g',
        'what-is-cl-to-g': 'blogs/what-is-cl-to-g',
        'density-guide': 'blogs/density-guide'
    }

    if page in blog_slugs:
        return render_template(get_template_name(blog_slugs[page], 'en'), lang_code='en', current_page_name=page)

    # Handle untranslated pages
    if page in UNTRANSLATED_PAGES:
        return render_page('en', page)

    return "Page Not Found", 404

# --- LOCALIZED HOME ROUTES ---
@app.route('/<lang_code>', strict_slashes=False)
def localized_home(lang_code):
    if lang_code not in SUPPORTED_LANGS:
        if lang_code in UNTRANSLATED_PAGES:
            return default_pages(lang_code)
        return redirect(url_for('home'))

    session['lang_code'] = lang_code
    return render_page(lang_code, 'home')

# --- ALL OTHER LOCALIZED PAGES (Including Blogs & Tools) ---
@lang_routes.route('/<page>', strict_slashes=False)
def localized_pages(lang_code, page):
    if lang_code not in SUPPORTED_LANGS:
        return redirect(url_for('home'))

    # Redirect untranslated pages to English
    if page in UNTRANSLATED_PAGES:
        return redirect(url_for('default_pages', page=page), code=302)

    session['lang_code'] = lang_code

    # Handle blogs
    if page == 'blogs':
        return render_template(get_template_name('blogs/blog_index', lang_code), lang_code=lang_code, current_page_name='blogs')

    blog_slugs = {
        'how-to-convert-cl-to-g': 'blogs/how-to-convert-cl-to-g',
        'what-is-cl-to-g': 'blogs/what-is-cl-to-g',
        'density-guide': 'blogs/density-guide'
    }

    if page in blog_slugs:
        return render_template(get_template_name(blog_slugs[page], lang_code), lang_code=lang_code, current_page_name=page)

    # Handle tool pages and other pages
    return render_page(lang_code, page)

# --- Common Render Function with French fallback ---
def render_page(lang_code, page):
    page_map = {
        'home': 'cl-to-g/cl-to-g',
        'cl-to-g': 'cl-to-g/cl-to-g',
        'g-to-cl': 'g-to-cl/g-to-cl',
        'l-to-kg': 'l-to-kg/l-to-kg',
        'about-us': 'pages/about-us',
        'contact': 'pages/contact',
        'privacy-policy': 'pages/privacy-policy',
        'terms-conditions': 'pages/terms-conditions',
    }

    if page not in page_map:
        return "Page Not Found", 404

    try:
        template_name = get_template_name(page_map[page], lang_code)
        return render_template(template_name, lang_code=lang_code, current_page_name=page)
    except Exception as e:
        # Fallback to French if template doesn't exist (except for English)
        if lang_code != 'en' and lang_code != 'fr':
            return render_page('fr', page)
        return f"""
        <h1>Error: Template not found for '{lang_code}' page '{page}'</h1>
        <p>Please check if the file '{template_name}' exists.</p>
        <p>Original error: {e}</p>
        """, 404

# --- Sitemap Route ---
@app.route('/sitemap.xml', strict_slashes=False)
def sitemap():
    return send_from_directory(app.root_path, 'sitemap.xml')

# --- Register Blueprints ---
app.register_blueprint(lang_routes)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
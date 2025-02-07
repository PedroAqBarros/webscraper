import requests
from bs4 import BeautifulSoup
import re  # Importa o módulo de expressões regulares

video_url = "VIDEO_URL"

response = requests.get(video_url)
response.raise_for_status()  # Lança uma exceção para erros HTTP

soup = BeautifulSoup(response.text, 'html.parser')

# --- Título ---
title_element = soup.find("meta", itemprop="name")
title = title_element["content"] if title_element else "Título não encontrado"

# --- Data (mais complicado, usa expressões regulares) ---
date_element = soup.find("meta", itemprop="uploadDate")
upload_date = date_element["content"] if date_element else "Data não encontrada"

print(f"Título: {title}")
print(f"Data de upload (ISO): {upload_date}")
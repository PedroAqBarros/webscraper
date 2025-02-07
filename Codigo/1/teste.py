import requests
from bs4 import BeautifulSoup
import json
import csv

class ScraperFlow:
    """
    Uma extensão simplificada, semelhante ao Browserflow, para fazer scraping de dados 
    de páginas web.

    Permite definir uma sequência de ações (como navegar para URLs, selecionar elementos,
    extrair dados e exportar para JSON ou CSV) para automatizar a extração de dados.
    """

    def __init__(self):
        self.session = requests.Session()
        self.current_url = None
        self.data = []  # Armazena os dados extraídos
        self.actions = [] # Armazena a sequência de ações


    def navigate(self, url):
        """
        Navega para a URL especificada.

        Args:
            url: A URL para a qual navegar.
        """
        def _navigate():
            response = self.session.get(url)
            response.raise_for_status()  # Lança exceção se houver erro HTTP
            self.current_url = url
            self.soup = BeautifulSoup(response.text, 'html.parser')
            return response # Retorna o objeto response para uso posterior, se necessário
        
        self.actions.append((_navigate, ())) # Adiciona a função e os argumentos
        return self


    def select(self, selector, multiple=False, attribute=None,  extract_as=None,  name=None):
        """
        Seleciona elementos HTML usando um seletor CSS e extrai dados.

        Args:
            selector:  O seletor CSS para encontrar os elementos.
            multiple:  Se True, seleciona todos os elementos correspondentes.
                       Se False, seleciona apenas o primeiro.
            attribute: Se fornecido, extrai o valor do atributo especificado.
                       Se None, extrai o texto do elemento.
            extract_as:  (Opcional) Pode ser 'int', 'float', para converter o texto extraído.
            name: (Opcional) Um nome para o campo de dados extraído. Se não for fornecido, usa-se o seletor.

        Returns:
            self (para encadeamento de métodos).
        """

        def _select():
            if multiple:
                elements = self.soup.select(selector)
            else:
                element = self.soup.select_one(selector)
                elements = [element] if element else []  # Trata o caso de select_one retornar None

            extracted_data = []
            for element in elements:
                if attribute:
                    value = element.get(attribute)
                else:
                    value = element.get_text(strip=True)

                if value: # Só adiciona se o valor não for vazio
                    if extract_as == 'int':
                        try:
                            value = int(value)
                        except ValueError:
                            value = None # Ou outro valor padrão, como 0
                    elif extract_as == 'float':
                        try:
                            value = float(value)
                        except ValueError:
                            value = None
                    extracted_data.append(value)
            

            # Adiciona os dados à lista principal, considerando se é uma extração múltipla ou única
            if multiple:
                # Cria um dicionario para cada elemento, se houver um nome
                if name:
                    for val in extracted_data:
                         self.data.append({name: val})
                else:
                   if not self.data:
                       self.data = [[] for _ in range(len(extracted_data))] #Cria listas vazias
                   for i, val in enumerate(extracted_data):
                       self.data[i].append(val) # Adiciona o valor na lista correspondente.

            else:
                # Se não for múltiplo, adiciona um dicionário (ou atualiza se já existir)
                if name is None:
                    name = selector
                if len(self.data) == 0:
                    self.data.append({name: extracted_data[0] if extracted_data else None})
                else:
                    # Assume que estamos adicionando mais campos ao mesmo item
                    self.data[0][name] = extracted_data[0] if extracted_data else None

            return extracted_data #retorna os dados extraídos para possível uso em ações seguintes
            
        self.actions.append((_select, ()))
        return self

    def click(self, selector):
        """
        Simula um clique em um elemento na página (útil para carregar conteúdo dinâmico,
        mas requer um headless browser, como Selenium, que não está implementado aqui).
        Nesta versão básica, apenas *registra* a intenção de clicar, mas não executa
        o clique em si.
        """

        def _click():
            #  Implementação real do clique exigiria Selenium ou outro framework
            #  que controle um navegador real.  Aqui, apenas registramos.
            print(f"Simulação de clique no seletor: {selector}")
            # Exemplo (com Selenium - *não* executado aqui):
            # element = self.driver.find_element(By.CSS_SELECTOR, selector)
            # element.click()
            return None # Não retorna nada, pois é só simulação

        self.actions.append((_click, ()))
        return self

    def wait(self, seconds):
        """
        Espera por um determinado número de segundos (útil para dar tempo para o conteúdo
        dinâmico carregar, mas depende de bibliotecas externas como `time` para a implementação real).

        Nesta versão, apenas *registra* a intenção de esperar.
        """
        def _wait():
            print(f"Simulação de espera por {seconds} segundos")
            # Implementação real:
            # import time
            # time.sleep(seconds)
            return None

        self.actions.append((_wait, ()))
        return self

    def run(self):
        """
        Executa a sequência de ações definida.

        Returns:
            self: Retorna a própria instância, permitindo acessar os dados após a execução.
        """
        for action, args in self.actions:
            action(*args)
        return self
    

    def to_json(self, filename='data.json', indent=4):
        """
        Exporta os dados extraídos para um arquivo JSON.

        Args:
            filename: O nome do arquivo de saída.
            indent:  O nível de indentação para o JSON.
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=indent, ensure_ascii=False)
        print(f"Dados exportados para {filename}")


    def to_csv(self, filename='data.csv'):
        """
        Exporta os dados extraídos para um arquivo CSV.

        Args:
            filename: O nome do arquivo de saída.
        """
        if not self.data:
            print("Nenhum dado para exportar.")
            return

        # Lidar com diferentes estruturas de dados
        if isinstance(self.data[0], dict):  # Lista de dicionários (comum)
             # Extrai os nomes dos campos (chaves do primeiro dicionário)
            fieldnames = list(self.data[0].keys())
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.data)
        elif isinstance(self.data[0], list):  # Lista de listas
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                # Sem cabeçalho automático para lista de listas;  você pode adicionar manualmente, se necessário
                writer.writerows(self.data)
        else:  # Outro tipo de estrutura
           print("Estrutura de dados não suportada para CSV.")
           return
           

        print(f"Dados exportados para {filename}")


# --- Exemplo de Uso ---

# 1. Extração simples de uma página estática:

scraper = ScraperFlow()
scraper.navigate('https://www.example.com') \
       .select('h1', name='title') \
       .select('p', name='description') \
       .run() \
       .to_json('example.json')

print(scraper.data)  # [{'title': 'Example Domain', 'description': '...'}]


# 2. Extração de múltiplos itens:

scraper = ScraperFlow()
scraper.navigate('https://pt.wikipedia.org/wiki/Python')
scraper.select('table.infobox.wikitable > tbody > tr > th > a',  multiple=True,  name='links')
scraper.run()
scraper.to_csv('wikipedia_links.csv') # Cria CSV com os links
print(scraper.data)


# 3. Extração de atributos e conversão de tipos:

scraper = ScraperFlow()
scraper.navigate('https://pt.wikipedia.org/wiki/Python')
scraper.select('.infobox-data > a', multiple=True, attribute='href', name='url', extract_as='str') # Não faz nada na conversão
scraper.run()
print(scraper.data)


# 4. Exemplo mais completo (combinando os conceitos):

# Extrai todos os parágrafos e o título
scraper = ScraperFlow()
scraper.navigate('https://www.example.com')
scraper.select('h1', name='title')
scraper.select('p', multiple=True, name='paragraph')
scraper.run()
scraper.to_csv('example_paragraphs.csv') # Vai gerar um CSV onde cada linha tem o titulo e um parágrafo.
scraper.to_json('example_paragraphs.json')
print(scraper.data)


#5 Exemplo com *simulação* de espera e click (sem Selenium)
#   (Não executa o click nem a espera de fato)
scraper = ScraperFlow()
scraper.navigate("https://www.example.com")
scraper.wait(5)  # Simula espera de 5 segundos.
scraper.click("#botao-carregar-mais") # Simula click.
scraper.select(".item", multiple=True, name="item_title")
scraper.run()
print(scraper.data) # Os dados refletirão *apenas* a seleção, e não o efeito do click/wait.


#6 - Exemplo de raspagem e armazenamento em CSV e JSON
scraper = ScraperFlow()
scraper.navigate('https://pt.wikipedia.org/wiki/Python')
scraper.select('.infobox-label', multiple=True, name='label')
scraper.select('.infobox-data', multiple = True, name='data')

scraper.run()
scraper.to_json('infobox.json')
scraper.to_csv('infobox.csv')


# 7.  Combinando extrações múltiplas e únicas no mesmo run()

scraper = ScraperFlow()
scraper.navigate('https://www.example.com')
scraper.select('h1', name='title')  # Extração única
scraper.select('p', multiple=True, name='paragraphs')  # Extração múltipla
scraper.run()
print(scraper.data)  # [{'title': '...', 'paragraphs': ['...', '...']}, {'title':None, 'paragraphs': '...'}]
scraper.to_json('combined_example.json') # JSON mesclado
scraper.to_csv('combined_example.csv')

#8 Exemplo de dados que não existem

scraper = ScraperFlow()
scraper.navigate("https://www.example.com")
scraper.select("#elemento-que-nao-existe", name="nao_existe")  # Seletor inexistente
scraper.select(".classe-que-nao-existe", multiple=True, name="lista_vazia") # Seletor inexistente
scraper.run()
print(scraper.data)  # [{'nao_existe': None, 'lista_vazia': []}]
scraper.to_json("empty_data.json")  # JSON com valores nulos
scraper.to_csv("empty_data.csv") # CSV com cabeçalhos, mas sem linhas de dados

#9 - Testando as conversoes de tipo
scraper = ScraperFlow()
scraper.navigate("https://www.example.com")
# Como a página não possui números, os valores convertidos serão nulos
scraper.select('p', extract_as='int', name="paragrafo_int")
scraper.select('h1', extract_as='float', name='titulo_float')
scraper.run()
print(scraper.data) # [{'paragrafo_int': None, 'titulo_float': None}]
from langchain_community.chat_models.gigachat import GigaChat
from settings import GIGACHAT_AUTHORIZATION_KEY

def _text_generation(title: str, content: str) -> str:
  giga = GigaChat(credentials=GIGACHAT_AUTHORIZATION_KEY, verify_ssl_certs=False)
  response = giga.invoke(
  f"Задание Напиши развернутую SEO-оптимизированную статью для веб-сайта на тему: {title}"  
  f"Дополнительные требования от пользователя: {content}" \
  "Статья должна полностью раскрывать тему, используя твои знания." \
  "### Технические требования" \
  "1. **Объем**: 150-200 слов." \
  "2. **Структура**:" \
    "- Сплошной текст с разделением на абзацы, никаких нумерованных списков, заголовков и прочего." \
  "### Выходные данные" \
  "Только сплошной текст статьи и ничего больше")
  if response is not None:
    return response
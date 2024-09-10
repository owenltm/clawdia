from langchain_ollama import ChatOllama

def define_task():
    # Load LLM model
    llm = ChatOllama(
        model="llama3.1",
        temperature=0,
    )

if __name__ == "__main__" :
    define_task()
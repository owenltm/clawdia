from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from typing import Annotated
from starlette.responses import StreamingResponse
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import UnstructuredMarkdownLoader

from tasks.funcs.define import define_task

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

@router.get("/")
async def read_tasks():
    llm = ChatOllama(
        model="llama3.1",
        temperature=0,
    )

    prompt = ChatPromptTemplate.from_template("What is the definition of {topic}, in 100 words or less")

    chain = prompt | llm | StrOutputParser()

    return chain.invoke({"topic": "pizza"})

@router.get("/stream")
async def read_tasks():
    llm = ChatOllama(
        model="llama3.1",
        temperature=0,
    )

    prompt = ChatPromptTemplate.from_template("What is the definition of {topic}, in 100 words or less")

    chain = prompt | llm | StrOutputParser()

    return StreamingResponse(chain.stream({"topic": "pizza"}), media_type="text/plain")

@router.get("/report")
async def read_tasks():
    # Load LLM model
    llm = ChatOllama(
        model="llama3.1",
        temperature=0,
    )

    # Load knowlegde document (split & embed(?))
    define_task()

    # Retrieve query

    return "test"
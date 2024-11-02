FROM python:3.9.20
WORKDIR /backend
COPY requirements.txt /backend
COPY main.py /backend
RUN pip install -r requirements.txt 
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

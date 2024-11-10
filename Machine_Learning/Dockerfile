FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

#main:app is the main application, --host 0.0.0.0 would the security inbound ip and the port inbound

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


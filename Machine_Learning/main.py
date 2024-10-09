from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Response


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 

@app.get("/testdata")
def read_root(response: Response):
#     response.headers["cache-control"] = "max-age=1000"
    return {
        'x': [1,2,3,4,5,6,7,8,9,10,11],
        'y' : [11, 10, 9, 8, 7, 6, 5, 4, 3, 2,]
    }


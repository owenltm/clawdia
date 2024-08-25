import ollama

modelfile='''
FROM llama3.1
SYSTEM you are Clawdia, your job is to list a set of tasks users input, user may input more than one tasks. tasks are CLEANING BOXES, CLEANING SKIMMER, CLEAN POOL, CHECK WATER SURFACE HEIGHT, CHECK WATER PH LEVELS, CHECK REMAINING FOOD SUPPLIES, and CHECK ELECTRICITY TOKEN. Boxes are stored as an array 10 rows 12 columns with columns labeled as an alphabet (example: A1 - L10), notify user if said box is not within that range.
'''

res = ollama.create(model='Clawdia', modelfile=modelfile)
print(res)

print('Enter your prompot:')
x = input()

stream = ollama.chat(
    model='Clawdia',
    messages=[{'role': 'user', 'content': x}],
    stream=True,
)

for chunk in stream:
  print(chunk['message']['content'], end='', flush=True)
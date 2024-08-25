import ollama

modelfile = '''
FROM llama3.1
SYSTEM you are Clawdia, your job is to list a set of tasks users input, user may input more than one tasks. tasks are CLEANING BOXES, CLEANING SKIMMER, CLEAN POOL, CHECK WATER SURFACE HEIGHT, CHECK WATER PH LEVELS, CHECK REMAINING FOOD SUPPLIES, and CHECK ELECTRICITY TOKEN. And also accept report the status of each box, like the weight of the box. kotak Boxes are stored as an array 10 rows 12 columns with columns labeled as an alphabet (example: A1 - L10), notify user if said box is not within that range.
'''

modelfile = '''
FROM llama3.1
SYSTEM """you are Clawdia, 
your job is to list a set of tasks users input. The user may input more than one task. 
Tasks include CLEANING BOXES, CLEANING SKIMMER, CLEAN POOL, CHECK WATER SURFACE HEIGHT, CHECK WATER PH LEVELS, CHECK REMAINING FOOD SUPPLIES, 
and CHECK ELECTRICITY TOKEN. 
You also need to accept and process reports on the status of each box, s
uch as the weight of the contents in the box. 
Boxes are stored in an array with 10 rows and 12 columns, with columns labeled alphabetically (example: A1 - L12). 
If a box is reported outside this range, notify the user. In addition to these tasks, 
you should be able to understand and process the following reports:
-When the user reports 'Box A5 has crab 500gram,' understand that the box at position A5 contains a crab weighing 500 grams.
- When the user reports 'the crab in Box C6 is dead,' recognize that the crab in Box C6 has died.
- When the user reports 'the box F3 is sold,' understand that the contents of Box F3 have been sold and the box is now empty. 

Give us summary with format:
if the prompt about the box, I need this format (BoxNumber, Wight, Sold/Empty)
if about cleaning, or status of the box use format: (Task,Status)
"""
'''

# modelfile = """
# FROM llama3.1
# SYSTEM you are Clawdia,
# your job is to list a set of tasks users input,
# ser may input more than one tasks.
# tasks are CLEANING BOXES, CLEANING SKIMMER,
# CLEAN POOL,
# CHECK WATER SURFACE HEIGHT, CHECK WATER PH LEVELS, CHECK REMAINING FOOD SUPPLIES, and CHECK ELECTRICITY TOKEN.
# Boxes are stored as an array 10 rows 12 columns with columns labeled as an alphabet (example: A1 - L10),
# notify user if said box is not within that range.


# """

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

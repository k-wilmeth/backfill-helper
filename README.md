# Backfill Helper Tool
 - Automate your backfill routes based on toDaysBack/fromDaysBack. 
 - Set and adjust an increment variable to decide how many days to run at a time. 
 - Set and adjust the interval time to decide when the next route will run(every 2 minutes, every 10 minutes?)


## Preparation Steps
 - Run a Postgres query to find the earliest and latest dated record of your slice in UTC format
 - Plug those into the backfill-date.py script and run it (python3 backfill-date.py) to get the OLDESt date record. That is where you can start your backfilling

# How To Run
 - Fill out a .env file      
    USERNAME={es-conversion username}     
    PASSWORD={es-conversion password}     
 - `cd backfill-helper`
 - `npm i`
 - `npm run dev`

# How To Start An Automated Process
 - Customer Uphoria
    - Customer_Tag `http://localhost:3005/backfill/tags?indexes=<INDEX>&fromDaysBack=<FROMDAYS_BACK>&toDaysBack=<TO_DAYS_BACK>`
    - Customer_Uphoria `http://localhost:3005/backfill/tags?indexes=<INDEX>&fromDaysBack=<FROMDAYS_BACK>&toDaysBack=<TO_DAYS_BACK>`
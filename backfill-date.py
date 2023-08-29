# A script to convert UTC time into toDaysBack and fromDaysBack based on the current day.
# Helpful for backfilling ES data so we know how many days back to tart processes on
from datetime import datetime, timezone

# Specify the original date and time
oldest = datetime(2015, 1, 30, 0, 0, 0, 0, timezone.utc)
newest = datetime(2023, 7, 26, 0, 0, 0, 0, timezone.utc)

# Calculate the time difference between the original date and time and the current date and time
oldest_time_difference = datetime.now(timezone.utc) - oldest
newest_time_difference = datetime.now(timezone.utc) - newest

# Convert the time difference into days
oldest_days_difference = oldest_time_difference.days
newest_time_difference = newest_time_difference.days

# Print the number of days difference
print(f"OLDEST: {oldest_days_difference} days ago")
print(f"NEWEST: {newest_time_difference} days ago")
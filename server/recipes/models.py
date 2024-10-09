from django.db import models

# Create your models here.


class Recipe(models.Model):
    """
    Recipe Model

    These will be used to store "general recipe information"
    - title
    - desc
    - ingredients
    - instructions
    - created date

    and also categorization objects -- such as:

    - cuisine (italian, mexican, etc)
    - meal type (breakfast, lunch, dinner, snack)
    - style (fried, meal prep, etc)

    """

    CUISINE_CHOICES = [
        ("Italian", "Italian"),
        ("Mexican", "Mexican"),
        ("Chinese", "Chinese"),
        ("Korean", "Korean"),
        ("Japanese", "Japanese"),
        ("Phillipino", "Phillipino"),
        ("Vietnamese", "Vietnamese"),
        ("Thai", "Thai"),
        ("French", "French"),
        ("German", "German"),
        ("Greek", "Greek"),
        ("Middle Eastern", "Middle Eastern"),
        ("African", "African"),
        ("Caribbean", "Caribbean"),
        ("Brazilian", "Brazilian"),
        ("American", "American"),
        ("Indian", "Indian"),
        ("English", "English"),
        ("N/A", "N/A"),
    ]

    MEAL_TYPE_CHOICES = [
        ("Breakfast", "Breakfast"),
        ("Lunch", "Lunch"),
        ("Dinner", "Dinner"),
        ("Snack", "Snack"),
        ("Dessert", "Dessert"),
        ("N/A", "N/A"),
    ]

    STYLE_CHOICES = [
        ("Fried", "Fried"),
        ("Grilled", "Grilled"),
        ("Baked", "Baked"),
        ("Steamed", "Steamed"),
        ("Boiled", "Boiled"),
        ("Raw", "Raw"),
        ("Stir Fried", "Stir Fried"),
        ("Braised", "Braised"),
        ("Roasted", "Roasted"),
        ("Meal Prep", "Meal Prep"),
        ("N/A", "N/A"),
    ]

    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
        ("N/A", "N/A"),
    ]

    TIME_CHOICES = [
        ("quick", "quick"),
        ("some time", "some time"),
        ("long", "long"),
    ]

    # create the PSQL storage object

    title = models.CharField(max_length=64)
    description = models.TextField()
    ingredients = models.TextField()
    instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # and the categorization objects
    cuisine = models.CharField(max_length=64, choices=CUISINE_CHOICES)
    meal_type = models.CharField(max_length=64, choices=MEAL_TYPE_CHOICES)
    style = models.CharField(max_length=64, choices=STYLE_CHOICES)
    difficulty = models.CharField(max_length=64, choices=DIFFICULTY_CHOICES)

    def __str__(self):
        return f"{self.title} - {self.cuisine} - {self.meal_type} - {self.style} - {self.difficulty}"

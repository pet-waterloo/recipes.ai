import numpy as np


def find_a_b(x, y):
    # Transform x to X = 1/x
    X = np.array([1 / xi for xi in x])
    Y = np.array(y)

    # Stack X and a column of ones (for the intercept a)
    A = np.vstack([np.ones(len(X)), X]).T

    # Perform least squares linear regression
    solution = np.linalg.lstsq(A, Y, rcond=None)
    a, b = solution[0]

    return a, b


# Example data
x = [1, 3, 4, 6, 9, 15]
y = [4, 3.5, 2.9, 2.5, 2.75, 2.0]

a, b = find_a_b(x, y)
print("Estimated values: a =", a, ", b =", b)

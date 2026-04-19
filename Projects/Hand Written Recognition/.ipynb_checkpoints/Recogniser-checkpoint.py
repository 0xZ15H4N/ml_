import pygame
import sys
import numpy as np
import cv2
import joblib

# ------------------ SETTINGS ------------------
WSize_X = 640
WSize_Y = 480
BOUNDRY = 10

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED   = (255, 0, 0)

LABELS = {
    0:"ZERO", 1:"ONE", 2:"TWO", 3:"THREE", 4:"FOUR",
    5:"FIVE", 6:"SIX", 7:"SEVEN", 8:"EIGHT", 9:"NINE"
}

# ------------------ LOAD MODEL ------------------
model = joblib.load("./XGBoost_gpu_based.pkl")

# ------------------ INIT PYGAME ------------------
pygame.init()
screen = pygame.display.set_mode((WSize_X, WSize_Y))
pygame.display.set_caption("Handwritten Digit Recogniser")

font = pygame.font.SysFont("Arial", 32)
screen.fill(BLACK)

# ------------------ VARIABLES ------------------
drawing = False
x_coords = []
y_coords = []

# ------------------ MAIN LOOP ------------------
while True:

    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        # Start drawing
        if event.type == pygame.MOUSEBUTTONDOWN:
            drawing = True

        # Stop drawing
        if event.type == pygame.MOUSEBUTTONUP:
            drawing = False

            if len(x_coords) > 0 and len(y_coords) > 0:

                # Get bounding box
                min_x = max(min(x_coords) - BOUNDRY, 0)
                max_x = min(max(x_coords) + BOUNDRY, WSize_X)

                min_y = max(min(y_coords) - BOUNDRY, 0)
                max_y = min(max(y_coords) + BOUNDRY, WSize_Y)

                # Extract image from screen
                img = pygame.surfarray.array2d(screen)
                img = img[min_x:max_x, min_y:max_y].T.astype(np.float32)

                # Resize to 28x28
                img = cv2.resize(img, (28, 28))

                # Normalize
                img = img / 255.0

                # Flatten for XGBoost
                img = img.reshape(1, -1)

                pixel_values = img.flatten()

                pixel_dict = {
                    f"pixel_{i}": float(pixel_values[i])
                    for i in range(len(pixel_values))
                }

                with open("digit.txt","w") as f:
                    f.write(str(pixel_dict))
                

                # Predict
                prediction = model.predict(img)
                label = LABELS[int(prediction[0])]

                # Display prediction
                text_surface = font.render(label, True, RED)
                screen.blit(text_surface, (min_x, min_y - 40))

            # Reset coordinates
            x_coords = []
            y_coords = []

        # Draw while moving mouse
        if event.type == pygame.MOUSEMOTION and drawing:
            x, y = event.pos
            pygame.draw.circle(screen, WHITE, (x, y), 6)
            x_coords.append(x)
            y_coords.append(y)

        # Press N to clear screen
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_n:
                screen.fill(BLACK)

    pygame.display.update()
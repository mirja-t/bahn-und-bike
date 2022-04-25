# Bahn & Bike (SPA)

## Description of the App

This program displays train lines from Berlin that allow carrying a bike and how they are connected to long distance cycling routes.
There are good apps for getting train connections and for planning and tracking cycling trips, but little to bring them together. This app is meant to bridge the gap and make it easier to plan a trip when you have to bring bike and train connections together.

## Libraries

### React and Redux

The Frontend Application is built with React using `npx create React App`. It uses the Redux store.

+ React Spring

### Dynamic SVG rendering and animation

![dynamically rendered polylines](./assets/images/trainlines.png "Trainlines rendered dynamically")

The trainline data includes the latitude and longitude position of each stop. These are converted to svg polylines and rendered with a css dasharray animation in an svg containing the map background.

#### Train Data

The trainstop data is converted to a tree with the start destination as the tree root.

#### Cycling Routes

![dynamically rendered polylines](./assets/images/cyclingpath.png "Trainlines rendered dynamically")

If a cycling route is clicked, it is rendered as an svg path with beziers to the map. The beziers are calculated with a function in a custom hook that takes in the previous and the next stop position.

#### Clipping

The map clipping is calculated in a custom hook that calculates the size of the map cutout with the longest trainline distance from the starting point.

## Features

+ Show all direct trains routes from Berlin within the chosen time 
+ Show all cycling routes that cross the chosen train line
+ Show available train stations along a chosen cycling route when a leg of the cycling route was clicked
+ Show possible cycling route combinations when a leg of the cycling route was clicked
+ Show train routes from Berlin within the chosen time that include a train change


# Live Site
https://bahn-und-bike.eu
# Land Price Prediction

A machine learning project to predict land prices based on various features and historical data.

## Overview

This project uses machine learning algorithms to predict land prices by analyzing factors like location, size, zoning, nearby amenities, and historical transaction data.

## Features

- Data preprocessing and cleaning
- Exploratory Data Analysis (EDA)
- Feature engineering and selection
- Multiple ML models comparison
- Price prediction visualization
- Model performance evaluation

## Challenge

The challenge here was to achieve high-performance metrics without using **target encoding**. Using target encoding made the model's predictions significantly easier due to **data leakage**, so alternative feature engineering techniques were employed to ensure robust and generalizable predictions.

## Requirements

- Python 3.8+
- scikit-learn
- pandas
- numpy
- matplotlib
- seaborn
- xgboost

## Installation

```bash
git clone https://github.com/gokulsodar/land-price-prediction.git
cd land-price-prediction

import argparse

from sklearn.cross_validation import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.lda import LDA
import numpy as np

import preprocessing

def parse_args():
    parser = argparse.ArgumentParser(description="Keystroke Dynamics Tester")
    parser.add_argument("--path", dest="path", default="new_attempts.json", type=str,
        help="Path to file")
    parser.add_argument("--classifier", dest="classifier", default="svm",
        choices=["random_forests", "lda", "svm"], help="Type of classifier to use")

    return parser.parse_args()

def score(train_x, train_labels, test_x, test_labels, classifier_class):
    label_set = set(train_labels)

    far = 0.0
    frr = 0.0
    total = 0.0
    # Look at each user
    for l in label_set:
        train_y = train_labels.copy()
        test_y = test_labels.copy()

        # Replace the rest with intruder
        train_y[~(train_y==l)] = 'intruder'
        test_y[~(test_y==l)] = 'intruder'

        # Train
        classifier = classifier_class()
        classifier.fit(train_x, train_y)

        predicted_y = np.array([classifier.predict(x) for x in test_x])
        false_positives = np.sum((predicted_y.T==l) & ~(test_y==l))
        false_negatives = np.sum(~(predicted_y.T==l) & (test_y==l))

        far += false_positives
        frr += false_negatives
        total += len(predicted_y)

    return far / total, frr / total

if __name__=="__main__":
    args = parse_args()
    
    # Read in data
    print "Reading data..."
    users = preprocessing.read_data(args.path)

    # Feature Generation
    print "Feature Generation..."
    labels = []
    data = []
    for u in users:
        feats, num_trials = u.generate_features()
        labels += np.repeat(u.id, num_trials)
        data += np.split(feats, num_trials)

    labels = np.array(labels)
    data = np.array(data)[:,0,:]

    if args.classifier=="svm":
        classifier_class = LinearSVC
    elif args.classifier=="random_forests":
        classifier_class = RandomForestClassifier
    elif args.classifier=="lda":
        classifier_class = LDA

    overall_accuracy = 0.0
    total = 0.0
    kf = KFold(len(labels), n_folds=4)
    for train, test in kf:
        train_x = data[train]
        train_y = labels[train]
        test_x = data[test]
        test_y = labels[test]

        far, frr = score(train_x, train_y, test_x, test_y, classifier_class)
        print "FAR {}".format(far)
        print "FRR {}".format(frr)
        print "Accuracy {}".format(1.0 - far - frr)

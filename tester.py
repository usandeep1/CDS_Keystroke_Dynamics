import argparse

from sklearn.cross_validation import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.lda import LDA
import numpy as np

import preprocessing

def parse_args():
    parser = argparse.ArgumentParser(description="Keystroke Dynamics Tester")
    parser.add_argument("--path", dest="path", required=True, type=str,
        help="Path to file. REQUIRED")
    parser.add_argument("--classifier", dest="classifier", default="svm",
        choices=["random_forests", "lda", "svm"], help="Type of classifier to use")

    return parser.parse_args()

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
        num_trials = len(u.trials)
        feats = u.generate_features()
        labels += np.repeat(u.id, num_trials)
        data += np.split(feats, num_trials)

    labels = np.array(labels)
    data = np.array(data)

    overall_accuracy = 0.0
    total = 0.0
    kf = KFold(len(labels), n_folds=4)
    for train, test in kf:
        train_x = data[train]
        train_y = labels[train]
        test_x = data[test]
        test_y = labels[test]

        print "Training Classifier..."
        if args.classifier=="svm":
            classifier = SVC()
        elif args.classifier=="random_forests":
            classifier = RandomForestClassifier()
        elif args.classifier=="lda":
            classifier = LDA()

        classifier.fit(train_x, train_y)

        print "Test Classifier..."
        accuracy = classifier.score(test_x, test_y)
        print accuracy
        overall_accuracy += accuracy * len(test_y)
        total += len(test_y)

    print "Average Accuracy: {}".format(overall_accuracy / total)

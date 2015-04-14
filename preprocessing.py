import json
import numpy as np

class User:
    def __init__(self, id, password, trials=None):
        self.id = id
        self.password = password

        if trials is None:
            trials = []
        self.trials = trials

    def add_trial(self, trial):
        self.trials.append(trial)

    def generate_features(self, ignore_backspace=True):
        features = []
        num_trials = 0
        for t in self.trials:
            if ignore_backspace:
                if np.sum(t.valid) == len(t.valid):
                    features.append(t.flatten())
                    num_trials += 1

        features = np.array(features)
        return features, num_trials

class Trial:
    def __init__(self, **kwargs):
        self.start = np.array(kwargs['start_times'])
        s = self.start[0]
        self.start -= s
        self.end = np.array(kwargs['end_times'])
        self.end -= s
        if len(self.end) != len(self.start):
            print kwargs
        self.hold = self.end - self.start
        self.jump = np.append(self.start[1:],0) - self.end
        self.jump = self.jump[:-1]

        self.button_name = np.array(kwargs['buttons_pressed'])
        self.accel_x = np.array(kwargs['accel_x'], dtype=float)
        self.accel_y = np.array(kwargs['accel_y'], dtype=float)
        self.accel_z = np.array(kwargs['accel_z'], dtype=float)
        self.loc_x = np.array(kwargs['x_coords'], dtype=int)
        self.loc_y = np.array(kwargs['y_coords'], dtype=int)
        self.valid = self._valid_clicks()

    def _valid_clicks(self):
        valid = np.ones(len(self.start), dtype=bool)
        for i in xrange(len(self.start)):
            if self.button_name[i] == 'backspace':
                valid[i] = False
                if i > 0:
                    valid[i - 1] = False

        return valid

    def flatten(self):
        return np.concatenate((self.hold, self.jump, self.accel_x,
            self.accel_y, self.accel_z, self.loc_x, self.loc_y))

def valid_check(**kwargs):
    start = np.array(kwargs['start_times'])
    end = np.array(kwargs['end_times'])
    if len(end) != len(start):
        return False

    return True

def read_data(filename):
    datatable = {}
    with open(filename) as f:
        datatable = json.load(f)

    users = {}
    results = datatable.get('results', [])
    for attr in results:
        name = attr['user']
        if name not in users:
            password = attr['associated_password']
            users[name] = User(name, password)

        u = users[name]
        if valid_check(**attr):
            u.add_trial(Trial(**attr))

    return [u for _,u in users.iteritems()]

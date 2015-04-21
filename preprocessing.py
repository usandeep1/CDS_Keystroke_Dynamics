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

    def generate_features(self, type="basic"):
        features = []
        num_trials = 0
        for t in self.trials:
            f = None
            if type=="basic":
                f = self._basic_features()
            else:
                f = self._advanced_features()
            if f is not None:
                features.append(f)
                num_trials += 1

        features = np.array(features)
        return features, num_trials
    
    def _basic_features(self):
        f = None
        if np.sum(t.valid) == len(t.valid):
            f = t.flatten()
        return f

    def _advanced_features(self):
        f = None
        if np.sum(t.valid) == len(t.valid):
            ngraph = t.generate_ngraph
            return np.concatenate((self.hold, self.accel_x, self.accel_y, self.accel_z, ngraph))
        return f

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

    def generate_ngraph(self):
        ngraph = np.empty()
        # generate digraph features
        for i in xrange(len(self.start)-1):
            np.append(ngraph, self.start[i+1] - self.start[i])
        # generate trigraph features
        for j in xrange(len(self.start)-2):
            np.append(ngraph, self.start[i+2] - self.start[i])
        return ngraph


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

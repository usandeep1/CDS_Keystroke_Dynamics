import json
import numpy as np

class User:
    def __init__(self, id, password, trials=None):
        self.id = id
        self.password = password
        if trials==None:
            trials = []
        self.trials = trials

    def add_trial(self, trial):
        self.trials.append(trial)

class Trial:
    def __init__(self, **kwargs):
        self.start = np.array(kwargs['start'])
        self.end = np.array(kwargs['end'])
        self.button_name = np.array(kwargs['button_name'])
        self.accel_x = np.array(kwargs['accel_x'])
        self.accel_y = np.array(kwargs['accel_y'])
        self.accel_z = np.array(kwargs['accel_z'])
        self.loc_x = np.array(kwargs['loc_x'])
        self.loc_y = np.array(kwargs['loc_y'])
        self.valid = self._valid_clicks()

    def _valid_clicks(self):
        valid = np.ones(len(self.start), dtype=bool)
        for i in xrange(len(self.start)):
            if self.button_name[i] == 'delete':
                valid[i] = False
                if i > 0:
                    valid[i - 1] = False

        return valid

def read_data(filename):
    datatable = {}
    with open(filename) as f:
        datatable = json.load(f)

    users = []
    for id, attr in datatable.iteritems():
        password = attr['password']
        raw_trials = attr['trials']
        trials = [Trial(**t) for t in raw_trials]
            
        users.append(User(id, password, trials))

    return users

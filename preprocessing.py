import json

class User:
    def __init__(self, id, password, trials=None):
        self.id = id
        self.password = password
        if trials=None:
            trials = []
        self.trials = trials

    def add_trial(self, trial):
        self.trials.append(trial)

class Trial:
    def __init__(self, **kwargs):
        self.start = kwargs['start']
        self.end = kwargs['end']
        self.button_name = kwargs['button_name']
        self.accel_x = kwargs['accel_x']
        self.accel_y = kwargs['accel_y']
        self.accel_z = kwargs['accel_z']
        self.loc_x = kwargs['loc_x']
        self.loc_y = kwargs['loc_z']

def read_data(filename):
    datatable = json.load(filename)

    users = []
    for id, attr in datatable.iteritems():
        password = attr['password']
        raw_trials = attr['trials']
        trials = [Trial(**t) for t in raw_trials]
            
        u = User(id, password, trials)

    return users

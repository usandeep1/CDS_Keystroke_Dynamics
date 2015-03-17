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
        self.start = np.array(kwargs['start_times'])
        self.end = np.array(kwargs['end_times'])
        self.button_name = np.array(kwargs['buttons_pressed'])
        self.accel_x = np.array(kwargs['accel_x'])
        self.accel_y = np.array(kwargs['accel_y'])
        self.accel_z = np.array(kwargs['accel_z'])
        self.loc_x = np.array(kwargs['x_coords'])
        self.loc_y = np.array(kwargs['y_coords'])
        self.valid = self._valid_clicks()

    def _valid_clicks(self):
        valid = np.ones(len(self.start), dtype=bool)
        for i in xrange(len(self.start)):
            if self.button_name[i] == 'backspace':
                valid[i] = False
                if i > 0:
                    valid[i - 1] = False

        return valid

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
        u.add_trial(Trial(**attr))

    return [u for _,u in users.iteritems()]

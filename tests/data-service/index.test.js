const { it, assert } = require('../js-unit-test-library');
const data = require('../../data-service');

it("should throw error if can't read a file", () => {
  let _error, _data;
  data.read('workouts', '0', (error, data) => {
    _error = error;
    _data = data;
  });
  setTimeout(() => {
    assert.strictEqual(typeof _error, 'object');
  }, 100);
});

it('should read a file', () => {
  let _error, _data;
  data.read('workouts', '1', (error, data) => {
    _error = error;
    _data = data;
  });

  setTimeout(() => {
    assert.strictEqual(typeof _data, 'object');
    assert.strictEqual(_error, false);
  }, 100);
});

it("should throw error if can't write to a file", () => {
  data.create('workout', 'test', { message: 'hello' }, error => {
    assert.strictEqual(typeof error, 'object');
  });
});

it('should create a data in a file', () => {
  let _error;
  data.create('tests', 'test', { message: 'hello' }, error => {
    _error = error;
  });
  setTimeout(() => {
    assert.strictEqual(_error, false);
  }, 100);
});

it('should throw error if cannot delete a file', () => {
  let _error;
  data.delete('tests', '1', error => {
    _error = error;
  });
  setTimeout(() => {
    assert.strictEqual(typeof _error, 'object');
  }, 100);
});

it('should delete a file', () => {
  let _error;
  // Wait for a sec so that a test file is created, then delete it.
  setTimeout(() => {
    data.delete('tests', 'test', error => {
      _error = error;
    });
  }, 100);

  // Wait a little to check the result
  setTimeout(() => {
    assert.strictEqual(_error, false);
  }, 200);
});

it('should list files in a directory', () => {
  const list = data.list('workouts');
  assert.ok(list instanceof Array);
});

it('should read file synchronously', () => {
  const _data = data.readSync('workouts', '1');
  assert.strictEqual(typeof data, 'object');
});

it('should fail if no file found to update', () => {
  let _error;
  data.update('test', 'test', { message: 'hello' }, error => {
    _error = error;
  });
  setTimeout(() => {
    assert.strictEqual(_error instanceof Error, true);
  }, 100);
});

it('should update a file', () => {
  let _createError,
    _updateError,
    _deleteError = false;
  data.create('tests', 'test2', { message: 'hello' }, error => {
    _createError = error;
    if (!error) {
      data.update('tests', 'test2', { message: 'y' }, error => {
        _updateError = error;
        data.delete('tests', 'test2', error => {
          _deleteError = error;
        });
      });
    }
  });
  setTimeout(() => {
    assert.strictEqual(_createError, false);
    assert.strictEqual(_updateError, false);
    assert.strictEqual(_deleteError, false);
  }, 100);
});

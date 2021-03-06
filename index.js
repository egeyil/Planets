const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  // Planet must be confirmed,
  // its stellar flux must be between 0.36 and 1.11,
  // its radiues must be smaller than 1.6 earth radii,
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11
  );
};

fs.createReadStream('kepler_data.csv')
  .pipe(
    parse({
      comment: '#',
      columns: true,
    })
  )
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet['kepler_name'];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });

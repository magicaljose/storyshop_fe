const getHTMl = (item, char, getCardName, getRelationName) => {
  let world_HTML = `<br /><h3>${char && char.name && (char.name.val)}</h3>`;

  if (char.aliases && char.aliases.has) {
    world_HTML += `<br /><h4>Tags</h4>`;

    char.aliases.tags.map((ii, index) => {
      world_HTML += ii;
      world_HTML += ", ";
    });
  }

  if (char.photo && char.photo.has) {
    world_HTML += `<br /><h4>Photo</h4>`;

    char.photo.val.map((file, index) => {
      const url = file.url || "";
      let validURL = "";

      url.split("?") && url.split("?")[0] && url.split("?")[0].match(/\.(jpeg|jpg|png)$/) ? validURL = url : validURL = "";

      // console.log(validURL);

      const myImage = `<img crossorigin="anonymous" src="${validURL}" width="180" height="50" />`;

      world_HTML += `<div>${myImage}</div><br />`;
    });
  }

  if (char.description && char.description.has) {
    world_HTML += `<br /><h4>General Description</h4>`;

    world_HTML += `<div>${char.description.val || ""}</div>`;
  }

  if (char.relation && char.relation.has) {
    world_HTML += `<br /><h4>Relationships</h4>`;

    Object.entries(char.relation.val).map(([reKey, relData]) => {
      if (relData.charId && relData.relation && relData.type) {
        let charId = relData.charId;
        let relationCode = relData.relation;
        let type = relData.type;

        let charName = getCardName(type, charId);

        let of = item.toLowerCase();

        if (of === "specific location") {
          of = "specificLocation";
        }

        let relationName = getRelationName(of, type.toLowerCase(), relationCode);

        world_HTML += `<div>${char && char.name && (char.name.val)} - ${relationName} - ${charName || "unknown " + type}</div>`;
      }
    });
  }

  if (char.dna && char.dna.has) {
    world_HTML += `<br /><h4>${item.charAt(0).toUpperCase() + item.slice(1)} DNA</h4>`;

    char.dna.val && Object.entries(char.dna.val)
      .reverse().map(([key, dna]) => {
        world_HTML += `<div>Q. ${dna.question || ""}</div>`;
        world_HTML += `<div>A. ${dna.answer || ""}</div><br />`;
      });
  }

  if (char.availability && char.availability.has) {
    world_HTML += `<br /><h4>Availability</h4>`;

    world_HTML += `<div>${char.availability.val || ""}</div>`;

    /*world_HTML += `<div>
      <input type="radio" value="Available" checked=${char.availability.val === "Available" ? true : false}>
      <label for="Available">Available</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Locked" checked=${char.availability.val === "Locked" ? "checked" : false}>
      <label for="Locked">Locked</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="By Request" checked=${char.availability.val === "By Request" ? true : false}>
      <label for="By Request">By Request</label>
    </div>`;*/
  }

  if (char.occupation && char.occupation.has) {
    world_HTML += `<br /><h4>Occupation</h4>`;

    world_HTML += `<div>${char.occupation.val || ""}</div>`;
  }

  if (char.external_conflicts && char.external_conflicts.has) {
    world_HTML += `<br /><h4>External Conflicts</h4>`;

    world_HTML += `<div>${char.external_conflicts.val || ""}</div>`;
  }

  if (char.internal_conflicts && char.internal_conflicts.has) {
    world_HTML += `<br /><h4>Internal Conflicts</h4>`;

    world_HTML += `<div>${char.internal_conflicts.val || ""}</div>`;
  }

  if (char.background && char.background.has) {
    world_HTML += `<br /><h4>Background</h4>`;

    world_HTML += `<div>${char.background.val || ""}</div>`;
  }

  if (char.habits && char.habits.has) {
    world_HTML += `<br /><h4>Habits</h4>`;

    world_HTML += `<div>${char.habits.val || ""}</div>`;
  }

  if (char.personality && char.personality.has) {
    world_HTML += `<br /><h4>Personality</h4>`;

    world_HTML += `<div>${char.personality.val || ""}</div>`;
  }

  if (char.physical_description && char.physical_description.has) {
    world_HTML += `<br /><h4>Physical Description</h4>`;

    world_HTML += `<div>${char.physical_description.val || ""}</div>`;
  }

  if (char.orientation && char.orientation.has) {
    world_HTML += `<br /><h4>Orientation</h4>`;

    world_HTML += `<div>${char.orientation.val || ""}</div>`;

    /*world_HTML += `<div>
      <input type="radio" value="Straight" checked=${char.orientation.val === "Straight" ? true : false}>
      <label for="Straight">Straight</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Gay" checked=${char.orientation.val === "Gay" ? true : false}>
      <label for="Gay">Gay</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Lesbian" checked=${char.orientation.val === "Lesbian" ? true : false}>
      <label for="Lesbian">Lesbian</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Bisexual" checked=${char.orientation.val === "Bisexual" ? true : false}>
      <label for="Bisexual">Bisexual</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Demi" checked=${char.orientation.val === "Demi" ? true : false}>
      <label for="Demi">Demi</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Pan" checked=${char.orientation.val === "Pan" ? true : false}>
      <label for="Pan">Pan</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Asexual" checked=${char.orientation.val === "Asexual" ? true : false}>
      <label for="Asexual">Asexual</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Non-Sexual" checked=${char.orientation.val === "Non-Sexual" ? true : false}>
      <label for="Non-Sexual">Non-Sexual</label>
    </div>`;

    world_HTML += `<div>
      <input type="radio" value="Other" checked=${char.orientation.val === "Other" ? true : false}>
      <label for="Other">Other</label>
    </div>`;*/
  }

  if (char.working_notes && char.working_notes.has) {
    world_HTML += `<br /><h4>Working Notes</h4>`;

    world_HTML += `<div>${char.working_notes.val || ""}</div>`;
  }
  if (char.alignment && char.alignment.has) {
    world_HTML += `<br /><h4>Alignment</h4>`;

    world_HTML += `<div>${char.alignment.val && char.alignment.val.goods || ""}</div>`;
    world_HTML += `<div>${char.alignment.val && char.alignment.val.neutrals || ""}</div>`;
    world_HTML += `<div>${char.alignment.val && char.alignment.val.evils || ""}</div>`;
  }

  if (char.gender && char.gender.has) {
    world_HTML += `<br /><h4>Gender</h4>`;

    world_HTML += `<div>${char.gender.val || ""}</div>`;
  }

  if (char.ethnicity && char.ethnicity.has) {
    world_HTML += `<br /><h4>Ethnicity</h4>`;

    world_HTML += `<div>${char.ethnicity.val || ""}</div>`;
  }

  if (char.marital && char.marital.has) {
    world_HTML += `<br /><h4>Marital</h4>`;

    world_HTML += `<div>${char.marital.val || ""}</div>`;
  }

  if (char.birth && char.birth.has) {
    world_HTML += `<br /><h4>Birth Date</h4>`;

    world_HTML += `<div>${char.birth.val || ""}</div>`;
  }

  if (char.death && char.death.has) {
    world_HTML += `<br /><h4>Death Date</h4>`;

    world_HTML += `<div>${char.death.val || ""}</div>`;
  }

  if (char.start && char.start.has) {
    world_HTML += `<br /><h4>Start Date</h4>`;

    world_HTML += `<div>${char.start.val || ""}</div>`;
  }

  if (char.end && char.end.has) {
    world_HTML += `<br /><h4>End Date</h4>`;

    world_HTML += `<div>${char.end.val || ""}</div>`;
  }

  return world_HTML;
};

export default getHTMl;

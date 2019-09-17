import React from 'react';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { saveAs } from 'file-saver';
import {db} from 'config_db/firebase';
import oldDB from 'config_db/oldFirebaseDB';

import worldBuilders from '../worldBuilders.js';
import getRelations from './CardsPop/Relations/getRelations';
import loadingGF from 'assets/img/loding_loding.gif';

class GetUserContent extends React.Component {
  state = {
    worlds: {},
    dataLoaded: false,
    noneUser: false,
  }

  componentDidMount = () => {
    const { user_email } = this.props.match.params;

    if (!user_email) return;

    const ref = db.ref();

    ref.child("user").orderByChild("email_id")
      .equalTo(user_email).once("value").then((users) => {
        if (!users.val()) {
          this.setState({ noneUser: true })
          return;
        }

        const user_id = Object.keys(users.val())[0];

        this.getUserData(ref, user_id);
      });
  }

  componentDidUpdate = (prevProps, prevState) => {
    let cache1 = [];
    const _nextState = JSON.stringify(prevState.worlds, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache1.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache1.push(value);
        }
        return value;
    });
    cache1 = null;

    let cache2 = [];
    const _thisState = JSON.stringify(this.state.worlds, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache2.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache2.push(value);
        }
        return value;
    });
    cache2 = null;

    if (_nextState !== _thisState) {
      if (this.timmer) {
        clearTimeout(this.timmer);
        this.timmer = null;
      }

      this.timmer = setTimeout(() => {
        this.setState({ dataLoaded: true })
        this.printContent();
      }, 5000);
    }
  }

  getUserData = (ref, uid) => {
    ref.child("world").orderByChild("user_id")
      .equalTo(uid).once("value").then((worlds) => {
        if (!worlds.val()) return;

        worlds.forEach(world => {
          const world_id = world.key;
          const worldData = world.val();

          let _worldData = {};

          _worldData["html"] = `<h1>${worldData.name || ""}</h1>`;
          _worldData["name"] = worldData.name || "";
          _worldData["series"] = {};
          _worldData["builders"] = {};

          worldData["series"] = {};
          worldData["builders"] = {};

          this.setState(prevState => ({
            ...prevState,
            worlds: {
              ...prevState.worlds,
              [world_id]: _worldData
            }
          }));

          worldBuilders.map(type => {
            this.getBuilders(type.toLowerCase(), world_id);
          })

          ref.child("series").orderByChild("world_id")
            .equalTo(world_id).once("value").then((series) => {
              if (!series.val()) return;

              series.forEach(serie => {
                const series_id = serie.key;
                let seriesData = serie.val();

                let _seriesData = {};

                _seriesData["html"] = `<h2>${seriesData.name || ""}</h2>`;
                _seriesData["seasons"] = {};

                seriesData["seasons"] = {};

                this.setState(prevState => ({
                  ...prevState,
                  worlds: {
                    ...prevState.worlds,
                    [world_id]: {
                      ...prevState.worlds[world_id],
                      series: {
                        ...prevState.worlds[world_id].series,
                        [series_id]: _seriesData
                      }
                    }
                  }
                }));

                ref.child("season").orderByChild("series_id")
                  .equalTo(series_id).once("value").then((seasons) => {
                    if (!seasons.val()) return;

                    seasons.forEach(season => {
                      const season_id = season.key;
                      let seasonData = season.val();

                      let _seasonData = {};

                      _seasonData["html"] = `<h3>${seasonData.name || ""}</h3>`;
                      _seasonData["episodes"] = {};

                      seasonData["episodes"] = {};

                      this.setState(prevState => ({
                        ...prevState,
                        worlds: {
                          ...prevState.worlds,
                          [world_id]: {
                            ...prevState.worlds[world_id],
                            series: {
                              ...prevState.worlds[world_id].series,
                              [series_id]: {
                                ...prevState.worlds[world_id].series[series_id],
                                seasons: {
                                  ...prevState.worlds[world_id].series[series_id].seasons,
                                  [season_id]: _seasonData
                                }
                              }
                            }
                          }
                        }
                      }));

                      ref.child("test_episode").child(season_id)
                        .once("value").then((episodes) => {
                          if (!episodes.val()) return;

                          episodes.forEach(episode => {
                            const episode_id = episode.key;
                            const episodeData = episode.val();

                            let _episodeData = {};

                            _episodeData["html"] = `<h4>${episodeData.name || ""}</h4>`;

                            if (!episodeData.scenes) {
                              episodeData["scenes"] = {};
                              _episodeData["scenes"] = {};
                            }

                            this.setState(prevState => ({
                              ...prevState,
                              worlds: {
                                ...prevState.worlds,
                                [world_id]: {
                                  ...prevState.worlds[world_id],
                                  series: {
                                    ...prevState.worlds[world_id].series,
                                    [series_id]: {
                                      ...prevState.worlds[world_id].series[series_id],
                                      seasons: {
                                        ...prevState.worlds[world_id].series[series_id].seasons,
                                        [season_id]: {
                                          ...prevState.worlds[world_id].series[series_id].seasons[season_id],
                                          episodes: {
                                            ...prevState.worlds[world_id].series[series_id].seasons[season_id].episodes,
                                            [episode_id]: _episodeData
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }));

                            if (episodeData.scenes) {
                              Object.entries(episodeData.scenes).map(([scene_id, sceneData]) => {
                                let _sceneData = {};

                                _sceneData["html"] = `
                                  <h5>${sceneData.title || "Scene"}</h5>
                                  <div>${sceneData.story || ""}</div>
                                  <h5>Summary</h5>
                                  <div>${sceneData.summary || ""}</div>
                                  <h5>Notes</h5>
                                  <div>${sceneData.notes || ""}</div>
                                `;

                                this.setState(prevState => ({
                                  ...prevState,
                                  worlds: {
                                    ...prevState.worlds,
                                    [world_id]: {
                                      ...prevState.worlds[world_id],
                                      series: {
                                        ...prevState.worlds[world_id].series,
                                        [series_id]: {
                                          ...prevState.worlds[world_id].series[series_id],
                                          seasons: {
                                            ...prevState.worlds[world_id].series[series_id].seasons,
                                            [season_id]: {
                                              ...prevState.worlds[world_id].series[series_id].seasons[season_id],
                                              episodes: {
                                                ...prevState.worlds[world_id].series[series_id].seasons[season_id].episodes,
                                                [episode_id]: {
                                                  ...prevState.worlds[world_id].series[series_id].seasons[season_id].episodes[episode_id],
                                                  scenes: {
                                                    ...prevState.worlds[world_id].series[series_id].seasons[season_id].episodes[episode_id].scenes,
                                                    [scene_id]: _sceneData
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }));
                              })
                            }
                          })
                        });
                    })
                  });
              })
            });
        })
      });
  }

  getBuilders = (type, world_id) => {
        const ref = db.ref();
        const builder = ref.child("builder");

        const fieldsDB = builder.child(type);
        const relationDB = builder.child("relation");

        fieldsDB.orderByChild("world_id")
                .equalTo(world_id).on("value", snapshot => {
                    snapshot.forEach(snap => {
                      let charKey = snap.key;
                      let fields = snap.val();

                      fields["oldDBrelation"] = {};

                      if (type === "character") {
                        oldDB.ref().child("characters").child(world_id).child(charKey)
                        .once('value').then(oldCharacter => {
                          if (!oldCharacter.val()) return;
                          if (oldCharacter.val().deleted) return;
                          if (!oldCharacter.val().relationship) return;

                          const oldRelation = oldCharacter.val().relationship;

                          Object.entries(oldRelation).map(([char_id, relData]) => {
                            this.setState(prevState => ({
                                    ...prevState,
                                    worlds: {
                                      ...prevState.worlds,
                                      [world_id]: {
                                        ...prevState.worlds[world_id],
                                        builders: {
                                          ...prevState.worlds[world_id].builders,
                                          [type]: {
                                            ...prevState.worlds[world_id].builders[type],
                                            [charKey]: {
                                              ...prevState.worlds[world_id].builders[type][charKey],
                                              oldDBrelation: {
                                                ...prevState.worlds[world_id].builders[type][charKey].oldDBrelation,
                                                [char_id]: relData
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                }));
                          })
                        })
                      }

                      fields["relation"] = {};

                      if (fields.relations) {
                          let val_obj = {};

                          fields.relations.map(key => {
                              const child = relationDB.child(key);

                              child.once("value").then(snapshot => {
                                if (!snapshot) return;
                                if (!snapshot.val()) return;

                                this.setState(prevState => ({
                                    ...prevState,
                                    worlds: {
                                      ...prevState.worlds,
                                      [world_id]: {
                                        ...prevState.worlds[world_id],
                                        builders: {
                                          ...prevState.worlds[world_id].builders,
                                          [type]: {
                                            ...prevState.worlds[world_id].builders[type],
                                            [charKey]: {
                                              ...prevState.worlds[world_id].builders[type][charKey],
                                              relation: {
                                                ...prevState.worlds[world_id].builders[type][charKey].relation,
                                                [key]: snapshot.val()
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                }));
                              })
                          });
                      }

                      this.setState(prevState => ({
                          ...prevState,
                          worlds: {
                            ...prevState.worlds,
                            [world_id]: {
                              ...prevState.worlds[world_id],
                              builders: {
                                ...prevState.worlds[world_id].builders,
                                [type]: {
                                  ...prevState.worlds[world_id].builders[type],
                                  [charKey]: fields
                                }
                              }
                            }
                          }
                      }));
                    });
                });
    }

  printContent = () => {
    const { worlds } = this.state;

    let html = "<div>";

    Object.entries(worlds).map(([world_id, worldData]) => {
      html += worldData.html;

      worldData.series && Object.entries(worldData.series).sort(([eKey1, eData1], [eKey2, eData2]) => parseInt(eData1.sort || 0) - parseInt(eData2.sort || 0)).map(([series_id, seriesData]) => {
        html += seriesData.html;

        seriesData.seasons && Object.entries(seriesData.seasons).sort(([eKey1, eData1], [eKey2, eData2]) => parseInt(eData1.sort || 0) - parseInt(eData2.sort || 0)).map(([season_id, seasonData]) => {
          html += seasonData.html;

          seasonData.episodes && Object.entries(seasonData.episodes).sort(([eKey1, eData1], [eKey2, eData2]) => parseInt(eData1.sort || 0) - parseInt(eData2.sort || 0)).map(([episode_id, episodeData]) => {
            html += episodeData.html;

            episodeData.scenes && Object.entries(episodeData.scenes).sort(([eKey1, eData1], [eKey2, eData2]) => parseInt(eData1.sort || 0) - parseInt(eData2.sort || 0)).map(([scene_id, sceneData]) => {
              html += sceneData.html;
            })
          })
        })
      })

      if (worldData.builders) {
        html += `<h1>World Bar of ${worldData.name}</h1>`;

        const getBase64Image = (imgURL) => {
          // let img = new Image(100, 200);
          let img = document.createElement("img")
          // img.crossOrigin = 'Anonymous';
          img.setAttribute('crossorigin', 'anonymous');
          img.src = imgURL;

          /*img.onload = function() {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let dataURL;
            canvas.height = 100;
            canvas.width = 200;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL("image/png");
            canvas = null;

            return dataURL;
          }*/
          return img
        }

        const getCardName = (type, id) => {
          let result = "";

          const getName = worldData.builders[type];

          if (getName && getName[id]) {
            if (getName[id].name) {
              result = getName[id].name;
            }
          }

          return result;
        }

        const getRelationName = (of, ofwith, code) => {
          let result = "";

          if (getRelations[of] && getRelations[of][ofwith] && getRelations[of][ofwith][code]) {
            result = getRelations[of][ofwith][code];
          }

          return result;
        }

        Object.entries(worldData.builders).map(([type, item]) => {
          html += `<h2>${type.charAt(0).toUpperCase() + type.slice(1)}</h2>`;

          Object.entries(item).map(([charKey, char], index) => {
            let a = getHTMl(type, char, getBase64Image, getCardName, getRelationName);
            html += a;
          })
        })
      }
    })

    html += "</div>";

    const converted = htmlDocx.asBlob(html);

    saveAs(converted, `${this.props.match.params.user_email}-${new Date().getTime()}.docx`);
  }

  render() {
    // console.log(this.state);
    if (this.state.dataLoaded) {
        return <div></div>;
    }

    if (this.state.noneUser) {
      return (
        <center>
          <h2>User Not Found!</h2>
        </center>
      );
    }

    return (
      <center>
        <img src={loadingGF} alt="loading..." />
      </center>
    )
  }
}

const getHTMl = (item, char, getBase64Image, getCardName, getRelationName) => {
  let world_HTML = `<h3>${char && char.name || ""}</h3>`;

  if (char.aliases) {
    world_HTML += `<h4>Tags</h4>`;

    char.aliases.map((ii, index) => {
      world_HTML += ii;
      world_HTML += ", ";
    });
  }

  if (char.photo) {
    world_HTML += `<h4>Photo</h4>`;

    char.photo.map((file, index) => {
    });
  }

  if (char.description) {
    world_HTML += `<h4>General Description</h4>`;

    world_HTML += `<div>${char.description || ""}</div>`;
  }

  if (char.relation) {
    world_HTML += `<h4>Relationships</h4>`;

    if (char.oldDBrelation) {
      Object.entries(char.oldDBrelation).map(([reKey, relData]) => {
        if (relData.nature) {
          let type = "character";
          let charId = reKey;
          let relationName = getRelationCode[relData.nature];

          let charName = getCardName("character", charId);

          world_HTML += `<div>${char && char.name} - ${relationName} - ${charName || "unknown character"}</div>`;
        }
      })
    }

    Object.entries(char.relation).map(([reKey, relData]) => {
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

        world_HTML += `<div>${char && char.name} - ${relationName} - ${charName || "unknown " + type}</div>`;
      }
    });
  }

  if (char.dna) {
    world_HTML += `<h4>${item.charAt(0).toUpperCase() + item.slice(1)} DNA</h4>`;

    char.dna && Object.entries(char.dna)
      .reverse().map(([key, dna]) => {
        world_HTML += `<div>Q. ${dna.question || ""}</div>`;
        world_HTML += `<div>A. ${dna.answer || ""}</div><br />`;
      });
  }

  if (char.availability) {
    world_HTML += `<h4>Availability</h4>`;

    world_HTML += `<div>${char.availability || ""}</div>`;
  }

  if (char.occupation) {
    world_HTML += `<h4>Occupation</h4>`;

    world_HTML += `<div>${char.occupation || ""}</div>`;
  }

  if (char.external_conflicts) {
    world_HTML += `<h4>External Conflicts</h4>`;

    world_HTML += `<div>${char.external_conflicts || ""}</div>`;
  }

  if (char.internal_conflicts) {
    world_HTML += `<h4>Internal Conflicts</h4>`;

    world_HTML += `<div>${char.internal_conflicts || ""}</div>`;
  }

  if (char.background) {
    world_HTML += `<h4>Background</h4>`;

    world_HTML += `<div>${char.background || ""}</div>`;
  }

  if (char.habits) {
    world_HTML += `<h4>Habits</h4>`;

    world_HTML += `<div>${char.habits || ""}</div>`;
  }

  if (char.personality) {
    world_HTML += `<h4>Personality</h4>`;

    world_HTML += `<div>${char.personality || ""}</div>`;
  }

  if (char.physical_description) {
    world_HTML += `<h4>Physical Description</h4>`;

    world_HTML += `<div>${char.physical_description || ""}</div>`;
  }

  if (char.orientation) {
    world_HTML += `<h4>Orientation</h4>`;

    world_HTML += `<div>${char.orientation || ""}</div>`;
  }

  if (char.working_notes) {
    world_HTML += `<h4>Working Notes</h4>`;

    world_HTML += `<div>${char.working_notes || ""}</div>`;
  }

  if (char.alignment) {
    world_HTML += `<h4>Alignment</h4>`;

    world_HTML += `<div>Goods - ${char.alignment.goods || ""}</div>`;
    world_HTML += `<div>Neutrals - ${char.alignment.neutrals || ""}</div>`;
    world_HTML += `<div>Evils - ${char.alignment.evils || ""}</div>`;
  }

  if (char.gender) {
    world_HTML += `<h4>Gender</h4>`;

    world_HTML += `<div>${char.gender || ""}</div>`;
  }

  if (char.ethnicity) {
    world_HTML += `<h4>Ethnicity</h4>`;

    world_HTML += `<div>${char.ethnicity || ""}</div>`;
  }

  if (char.marital) {
    world_HTML += `<h4>Marital</h4>`;

    world_HTML += `<div>${char.marital || ""}</div>`;
  }

  if (char.birth) {
    world_HTML += `<h4>Birth Date</h4>`;

    world_HTML += `<div>${char.birth || ""}</div>`;
  }

  if (char.death) {
    world_HTML += `<h4>Death Date</h4>`;

    world_HTML += `<div>${char.death || ""}</div>`;
  }

  if (char.start) {
    world_HTML += `<h4>Start Date</h4>`;

    world_HTML += `<div>${char.start || ""}</div>`;
  }

  if (char.end) {
    world_HTML += `<h4>End Date</h4>`;

    world_HTML += `<div>${char.end || ""}</div>`;
  }

  return world_HTML;
};

const getRelationCode =  {
  "friend": "Friend of",
  "nemesis": "Nemesis of",
  "romantic": "Romantic with",
  "spouse": "Spouse of",
  "partner": "Partner of",
  "ex-spouse": "Ex-Spouse of",
  "ex-romantic": "Ex-Romantic with",
  "relative": "Relative of",
  "parent": "Parent of",
  "child": "Child of",
  "sibling": "Sibling of",
  "grandparent": "Grandparent of",
  "grandchild": "Grandchild of",
  "colleague": "Colleague of",
  "other": "Other with" 
}

export default GetUserContent;
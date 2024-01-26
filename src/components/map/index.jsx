import React, { useEffect, useState } from "react";
import Card from "components/card";
import {
  MdDelete,
  MdOutlinePauseCircle,
  MdOutlinePlayCircle,
} from "react-icons/md";
import { io } from "socket.io-client";
import { BASE_URL } from "utils/constants";
import { useParams } from "react-router-dom";
import DrawControl from "react-mapbox-gl-draw";
import ReactMapboxGl, { Marker, GeoJSONLayer } from "react-mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { createPerimetro } from "services/tutorado.service";
import { getPerfilTutorado } from "services/tutorado.service";
import { deletePerimetro } from "services/tutorado.service";
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";

// Definir las coordenadas del polígono
export const perimeterCoordinates = [
  [-74.0, 40.7],
  [-74.0, 40.8],
  [-73.9, 40.8],
  [-73.9, 40.7],
];
const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZGF2aWR2ZWxleiIsImEiOiJjazl1YWxzbTAwMGZsM3BscGgxM2E3aHNvIn0.BLd4VKwQHeWOGxGqDM97pw",
});
const MyMap = () => {
  const { id } = useParams();
  const [tutorado, setTutorado] = useState({});
  const [perimetro, setPerimetro] = useState([]);
  const [realTime, setRealTime] = useState(true);

  const socket = io(BASE_URL);
  const [coords, seCoords] = useState({
    latitude: -0.9585409,
    longitude: -80.7076839,
  });

  const [userLocation, setUserLocation] = useState({
    longitude: coords?.longitude,
    latitude: coords?.latitude,
    tutorado: {},
    zoom: 13,
  });
  const { language } = useLanguage();
  const { buttons, profile } = idioma[language];

  useEffect(() => {
    const getData = async (id) => {
      const data = await getPerfilTutorado(id);
      setPerimetro([data?.tutorado?.perimetro] || [[]]);
      setTutorado(data);
      obtenerUbicacionDB(data?.tutorado?.ubicacion);
    };
    getData(id);

    socket.on("ubicacion", (data) => {
      seCoords(data);
      obtenerUbicacion(data);
    });

    return () => {
      socket.off("ubicacion");
      socket.disconnect();
    };
  }, []);

  const onDrawCreate = async ({ features }) => {
    let k = features[0].geometry.coordinates;
    const resp = await createPerimetro(id, k[0]);
    if (resp?.status === 201) {
      const response = await getPerfilTutorado(id);
      setPerimetro([response?.tutorado?.perimetro] || [[]]);
      await socket.emit("actualizarPerimetro", response?.tutorado);
    }
  };

  const onDrawUpdate = ({ features }) => {
    console.log(features);
  };

  const obtenerUbicacion = async (position = {}) => {
    const data = position?.[id];
    const latitude = data?.latitude || coords?.latitude;
    const longitude = data?.longitude || coords?.longitude;
    setUserLocation({ latitude, longitude, zoom: 16 });
  };

  const obtenerUbicacionDB = async ({ latitude, longitude }) => {
    setUserLocation({ latitude, longitude, zoom: 16 });
  };
  const eliminarPerimetro = async () => {
    const response = await deletePerimetro(id);
    if (response?.status === 201) {
      setPerimetro([[]]);
    }
  };

  const detenerTiempoReal = async () => {
    const status = realTime ? false : true;
    setRealTime(status);
    await socket.emit("realTime", status);
  };

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          text: "Fort Greene",
        },
        geometry: {
          type: "Polygon",
          coordinates: perimetro,
        },
      },
    ],
  };
  const geojsonStyles = {
    lineLayout: {
      "line-join": "round",
      "line-cap": "round",
    },
    linePaint: {
      "line-color": "#28EE11",
      "line-width": 4,
      "line-opacity": 1,
    },
    symbolLayout: {
      "text-field": "{text}",
      "symbol-placement": "line",
      "text-rotation-alignment": "map",
      "text-size": {
        base: 1,
        stops: [
          [9, 9],
          [14, 12],
        ],
      },
    },
    symbolPaint: {
      "text-color": "rgba(0, 0, 0, 1)",
      "text-halo-color": "rgba(255, 255, 255, 1)",
      "text-halo-width": 2,
    },
  };
  return (
    <Card extra={"items-center w-full h-full mt-3 p-[16px] bg-cover"}>
      <div className="mb-4 flex w-full items-center justify-end gap-3">
        {userLocation?.latitude !== -0.9585409 &&
          userLocation?.longitude !== -80.7076839 && (
            <button
              className={`flex items-center justify-end gap-2 rounded-md text-gray-800 dark:bg-navy-700  dark:text-white ${
                realTime
                  ? "bg-amber-100 p-3  hover:bg-amber-200"
                  : "bg-green-300 p-3 hover:bg-green-400 hover:text-white"
              }`}
              onClick={detenerTiempoReal}
            >
              <p className="font-medium">
                {realTime ? buttons?.pausar : buttons?.renaurar}
              </p>
              {realTime ? <MdOutlinePauseCircle /> : <MdOutlinePlayCircle />}
            </button>
          )}
        {perimetro?.[0] && perimetro[0].length > 0 && (
          <button
            className=" flex items-center justify-end gap-2 rounded-md bg-red-300 p-3 text-gray-800  hover:bg-red-900 hover:text-white dark:bg-navy-700 dark:text-white"
            onClick={eliminarPerimetro}
          >
            <p className="font-medium">{buttons?.eliminar}</p>
            <MdDelete />
          </button>
        )}
      </div>

      <Map
        style="mapbox://styles/mapbox/streets-v8" // eslint-disable-line
        containerStyle={{
          height: "500px",
          width: "100%",
        }}
        zoom={[userLocation.zoom]}
        center={[userLocation.longitude, userLocation.latitude]}
      >
        {userLocation?.latitude !== -0.9585409 &&
          userLocation?.longitude !== -80.7076839 && (
            <Marker
              coordinates={[userLocation?.longitude, userLocation?.latitude]}
              anchor="bottom"
              className="custom-martke"
            >
              <div className="m-auto animate-bounce text-center">
                <span className="bg-gray-900 p-1 px-2 text-sm font-bold text-white">
                  {profile?.text2}
                </span>
                <img
                  className="m-auto "
                  src="https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_960_720.png"
                  alt="Marcador"
                  width={20}
                  height={30}
                />
              </div>
            </Marker>
          )}
        <DrawControl
          onDrawCreate={onDrawCreate}
          onDrawUpdate={onDrawUpdate}
          displayControlsDefault={false}
          controls={{ polygon: true }}
        />
        <GeoJSONLayer {...geojsonStyles} data={geojson} />
      </Map>
    </Card>
  );
};

export default MyMap;

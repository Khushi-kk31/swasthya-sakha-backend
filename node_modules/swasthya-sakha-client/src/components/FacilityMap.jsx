import React from 'react';
import {MapContainer,TileLayer,Marker,Popup} from 'react-leaflet';
import L from 'leaflet';
import {facilities} from '../data';
import 'leaflet/dist/leaflet.css';
const icon=L.divIcon({className:'custom-marker',html:'<div style="width:28px;height:28px;border-radius:50%;background:#0f766e;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25)"></div>',iconSize:[28,28],iconAnchor:[14,14]});
export default function FacilityMap({height='420px'}){return <div className="rounded-2xl overflow-hidden border border-slate-200" style={{height}}><MapContainer center={[19.09,72.87]} zoom={12} scrollWheelZoom={false}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{facilities.map(f=><Marker key={f.id} position={[f.lat,f.lng]} icon={icon}><Popup><div className="min-w-[180px]"><b>{f.name}</b><div className="text-xs text-slate-500 mt-1">{f.type}</div><div className="grid grid-cols-2 gap-2 mt-2 text-xs"><span>Beds: <b>{f.beds}</b></span><span>ICU: <b>{f.icu}</b></span><span>Specialists: <b>{f.specialists}</b></span><span>Diagnostics: <b>{f.diagnostics}</b></span></div></div></Popup></Marker>)}</MapContainer></div>}

import { NextResponse } from 'next/server';

/**
 * Endpoint de salud para monitoreo de Coolify/Docker.
 * Retorna 200 OK si el servidor está respondiendo.
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
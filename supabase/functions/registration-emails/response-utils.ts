
export function createErrorResponse(error: any, corsHeaders: Record<string, string>) {
  console.error('Error sending email:', error);
  console.error('Error stack:', error.stack);
  
  return new Response(
    JSON.stringify({ 
      error: error.message, 
      stack: error.stack,
      message: 'Failed to send email. Please check server logs for details.'
    }),
    {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

export function createSuccessResponse(result: any, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function createCorsResponse(corsHeaders: Record<string, string>) {
  return new Response(null, { headers: corsHeaders });
}

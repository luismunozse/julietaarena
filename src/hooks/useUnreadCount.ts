'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useUnreadCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      const { count: total, error } = await supabase
        .from('property_inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'nueva')

      if (!error && total !== null) {
        setCount(total)
      }
    }

    fetchCount()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('unread-inquiries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'property_inquiries' },
        () => { fetchCount() }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return count
}

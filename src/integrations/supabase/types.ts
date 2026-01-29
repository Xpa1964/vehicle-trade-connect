export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      announcement_attachments: {
        Row: {
          announcement_id: string | null
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          storage_path: string
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          storage_path: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          storage_path?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_attachments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          category: string | null
          contact_info: Json | null
          content: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          images: Json | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          category?: string | null
          contact_info?: Json | null
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          images?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          category?: string | null
          contact_info?: Json | null
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          images?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      api_key_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          name: string | null
          purpose: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          purpose?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          purpose?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json | null
          rate_limit: number | null
          request_count: number | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          rate_limit?: number | null
          request_count?: number | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          rate_limit?: number | null
          request_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      api_request_logs: {
        Row: {
          action: string | null
          api_key_id: string | null
          created_at: string | null
          endpoint: string | null
          error_count: number | null
          error_message: string | null
          id: string
          ip_address: string | null
          method: string | null
          response_time_ms: number | null
          status_code: number | null
          success_count: number | null
          vehicle_count: number | null
        }
        Insert: {
          action?: string | null
          api_key_id?: string | null
          created_at?: string | null
          endpoint?: string | null
          error_count?: number | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          success_count?: number | null
          vehicle_count?: number | null
        }
        Update: {
          action?: string | null
          api_key_id?: string | null
          created_at?: string | null
          endpoint?: string | null
          error_count?: number | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          success_count?: number | null
          vehicle_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_request_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_sync_logs: {
        Row: {
          action: string | null
          api_key_id: string | null
          created_at: string | null
          details: Json | null
          error_count: number | null
          error_message: string | null
          id: string
          success_count: number | null
          vehicle_count: number | null
        }
        Insert: {
          action?: string | null
          api_key_id?: string | null
          created_at?: string | null
          details?: Json | null
          error_count?: number | null
          error_message?: string | null
          id?: string
          success_count?: number | null
          vehicle_count?: number | null
        }
        Update: {
          action?: string | null
          api_key_id?: string | null
          created_at?: string | null
          details?: Json | null
          error_count?: number | null
          error_message?: string | null
          id?: string
          success_count?: number | null
          vehicle_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_sync_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          bid_increment: number | null
          buy_now_price: number | null
          created_at: string | null
          created_by: string | null
          current_price: number | null
          description: string | null
          end_date: string | null
          end_time: string | null
          id: string
          increment_minimum: number | null
          reserve_price: number | null
          seller_id: string
          start_date: string | null
          start_time: string | null
          starting_price: number | null
          status: string | null
          terms_accepted: boolean | null
          title: string | null
          updated_at: string | null
          vehicle_id: string | null
          winner_id: string | null
        }
        Insert: {
          bid_increment?: number | null
          buy_now_price?: number | null
          created_at?: string | null
          created_by?: string | null
          current_price?: number | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          increment_minimum?: number | null
          reserve_price?: number | null
          seller_id: string
          start_date?: string | null
          start_time?: string | null
          starting_price?: number | null
          status?: string | null
          terms_accepted?: boolean | null
          title?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          winner_id?: string | null
        }
        Update: {
          bid_increment?: number | null
          buy_now_price?: number | null
          created_at?: string | null
          created_by?: string | null
          current_price?: number | null
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          increment_minimum?: number | null
          reserve_price?: number | null
          seller_id?: string
          start_date?: string | null
          start_time?: string | null
          starting_price?: number | null
          status?: string | null
          terms_accepted?: boolean | null
          title?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          amount: number
          auction_id: string | null
          bidder_id: string
          created_at: string | null
          id: string
          is_winning: boolean | null
        }
        Insert: {
          amount: number
          auction_id?: string | null
          bidder_id: string
          created_at?: string | null
          id?: string
          is_winning?: boolean | null
        }
        Update: {
          amount?: number
          auction_id?: string | null
          bidder_id?: string
          created_at?: string | null
          id?: string
          is_winning?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          content: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          recipient_id: string | null
          sender_id: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          recipient_id?: string | null
          sender_id?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          recipient_id?: string | null
          sender_id?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          admin_sender_name: string | null
          buyer_id: string
          created_at: string | null
          id: string
          is_admin_conversation: boolean | null
          is_pinned: boolean | null
          last_message_at: string | null
          seller_id: string
          source_id: string | null
          source_title: string | null
          source_type: string | null
          status: string | null
          unread_count: number | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          admin_sender_name?: string | null
          buyer_id: string
          created_at?: string | null
          id?: string
          is_admin_conversation?: boolean | null
          is_pinned?: boolean | null
          last_message_at?: string | null
          seller_id: string
          source_id?: string | null
          source_title?: string | null
          source_type?: string | null
          status?: string | null
          unread_count?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          admin_sender_name?: string | null
          buyer_id?: string
          created_at?: string | null
          id?: string
          is_admin_conversation?: boolean | null
          is_pinned?: boolean | null
          last_message_at?: string | null
          seller_id?: string
          source_id?: string | null
          source_title?: string | null
          source_type?: string | null
          status?: string | null
          unread_count?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_cases: {
        Row: {
          case_number: string | null
          complainant_id: string | null
          created_at: string | null
          defendant_id: string | null
          description: string | null
          dispute_type: string | null
          id: string
          priority: string | null
          resolution: string | null
          resolved_at: string | null
          status: string | null
          title: string | null
          transaction_id: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          case_number?: string | null
          complainant_id?: string | null
          created_at?: string | null
          defendant_id?: string | null
          description?: string | null
          dispute_type?: string | null
          id?: string
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          case_number?: string | null
          complainant_id?: string | null
          created_at?: string | null
          defendant_id?: string | null
          description?: string | null
          dispute_type?: string | null
          id?: string
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_cases_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          content: string
          created_at: string | null
          dispute_id: string | null
          id: string
          is_internal: boolean | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          is_internal?: boolean | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          is_internal?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "dispute_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      equipment_items: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "equipment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      exchanges: {
        Row: {
          cash_difference: number | null
          conversation_id: string | null
          created_at: string | null
          id: string
          initiator_id: string
          message: string | null
          offered_vehicle_id: string | null
          receiver_id: string | null
          requested_vehicle_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cash_difference?: number | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          initiator_id: string
          message?: string | null
          offered_vehicle_id?: string | null
          receiver_id?: string | null
          requested_vehicle_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cash_difference?: number | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          initiator_id?: string
          message?: string | null
          offered_vehicle_id?: string | null
          receiver_id?: string | null
          requested_vehicle_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exchanges_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_offered_vehicle_id_fkey"
            columns: ["offered_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_requested_vehicle_id_fkey"
            columns: ["requested_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          created_at: string | null
          current_location: string | null
          driver_id: string | null
          fleet_manager_id: string
          id: string
          next_service_date: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_location?: string | null
          driver_id?: string | null
          fleet_manager_id: string
          id?: string
          next_service_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_location?: string | null
          driver_id?: string | null
          fleet_manager_id?: string
          id?: string
          next_service_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_requests: {
        Row: {
          created_at: string | null
          id: string
          inspection_type: string | null
          inspector_id: string | null
          notes: string | null
          price: number | null
          report_url: string | null
          requester_id: string
          scheduled_date: string | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspection_type?: string | null
          inspector_id?: string | null
          notes?: string | null
          price?: number | null
          report_url?: string | null
          requester_id: string
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inspection_type?: string | null
          inspector_id?: string | null
          notes?: string | null
          price?: number | null
          report_url?: string | null
          requester_id?: string
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          message_type: string | null
          original_language: string | null
          read_at: string | null
          sender_id: string
          translated_content: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          original_language?: string | null
          read_at?: string | null
          sender_id: string
          translated_content?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          original_language?: string | null
          read_at?: string | null
          sender_id?: string
          translated_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_prefix: string | null
          last_used_at: string | null
          name: string
          permissions: Json | null
          rate_limit: number | null
          request_count: number | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_prefix?: string | null
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          rate_limit?: number | null
          request_count?: number | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_prefix?: string | null
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          rate_limit?: number | null
          request_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      performance_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
        }
        Relationships: []
      }
      premium_report_batches: {
        Row: {
          batch_number: string | null
          created_at: string | null
          created_by: string | null
          id: string
          processed_at: string | null
          report_ids: Json | null
          status: string | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          processed_at?: string | null
          report_ids?: Json | null
          status?: string | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          processed_at?: string | null
          report_ids?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          business_type: string | null
          city: string | null
          company_logo: string | null
          company_name: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          operations_breakdown: Json | null
          phone: string | null
          postal_code: string | null
          province: string | null
          rating: number | null
          registration_date: string | null
          show_business_stats: boolean | null
          show_contact_details: boolean | null
          show_location_details: boolean | null
          tax_id: string | null
          total_operations: number | null
          trader_type: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_type?: string | null
          city?: string | null
          company_logo?: string | null
          company_name?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          operations_breakdown?: Json | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          rating?: number | null
          registration_date?: string | null
          show_business_stats?: boolean | null
          show_contact_details?: boolean | null
          show_location_details?: boolean | null
          tax_id?: string | null
          total_operations?: number | null
          trader_type?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_type?: string | null
          city?: string | null
          company_logo?: string | null
          company_name?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          operations_breakdown?: Json | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          rating?: number | null
          registration_date?: string | null
          show_business_stats?: boolean | null
          show_contact_details?: boolean | null
          show_location_details?: boolean | null
          tax_id?: string | null
          total_operations?: number | null
          trader_type?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          from_user_id: string | null
          id: string
          rated_id: string
          rater_id: string
          rating: number | null
          to_user_id: string | null
          transaction_type: string | null
          verified: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          from_user_id?: string | null
          id?: string
          rated_id: string
          rater_id: string
          rating?: number | null
          to_user_id?: string | null
          transaction_type?: string | null
          verified?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          from_user_id?: string | null
          id?: string
          rated_id?: string
          rater_id?: string
          rating?: number | null
          to_user_id?: string | null
          transaction_type?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          admin_notes: string | null
          company_name: string | null
          contact_name: string | null
          created_at: string | null
          email: string
          id: string
          phone: string | null
          requested_role: Database["public"]["Enums"]["app_role"] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email: string
          id?: string
          phone?: string | null
          requested_role?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          phone?: string | null
          requested_role?: Database["public"]["Enums"]["app_role"] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          name: string | null
          notify: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          name?: string | null
          notify?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          name?: string | null
          notify?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      static_images: {
        Row: {
          ai_prompt: string | null
          category: string | null
          created_at: string | null
          id: string
          image_key: string
          image_url: string | null
          purpose: string | null
          storage_path: string | null
          updated_at: string | null
        }
        Insert: {
          ai_prompt?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          image_key: string
          image_url?: string | null
          purpose?: string | null
          storage_path?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_prompt?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          image_key?: string
          image_url?: string | null
          purpose?: string | null
          storage_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      translation_cache: {
        Row: {
          created_at: string | null
          id: string
          source_lang: string
          source_text: string
          target_lang: string
          translated_text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          source_lang: string
          source_text: string
          target_lang: string
          translated_text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          source_lang?: string
          source_text?: string
          target_lang?: string
          translated_text?: string
        }
        Relationships: []
      }
      transport_quote_responses: {
        Row: {
          admin_notes: string | null
          admin_user_id: string | null
          company_name: string | null
          created_at: string | null
          estimated_days: number | null
          estimated_delivery_date: string | null
          estimated_pickup_date: string | null
          id: string
          insurance_details: string | null
          notes: string | null
          quote_amount: number | null
          quoted_price: number | null
          response_status: string | null
          status: string | null
          terms_and_conditions: string | null
          transport_quote_id: string | null
          transporter_id: string
        }
        Insert: {
          admin_notes?: string | null
          admin_user_id?: string | null
          company_name?: string | null
          created_at?: string | null
          estimated_days?: number | null
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          id?: string
          insurance_details?: string | null
          notes?: string | null
          quote_amount?: number | null
          quoted_price?: number | null
          response_status?: string | null
          status?: string | null
          terms_and_conditions?: string | null
          transport_quote_id?: string | null
          transporter_id: string
        }
        Update: {
          admin_notes?: string | null
          admin_user_id?: string | null
          company_name?: string | null
          created_at?: string | null
          estimated_days?: number | null
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          id?: string
          insurance_details?: string | null
          notes?: string | null
          quote_amount?: number | null
          quoted_price?: number | null
          response_status?: string | null
          status?: string | null
          terms_and_conditions?: string | null
          transport_quote_id?: string | null
          transporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_quote_responses_transport_quote_id_fkey"
            columns: ["transport_quote_id"]
            isOneToOne: false
            referencedRelation: "transport_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_quotes: {
        Row: {
          brand: string | null
          chassis_number: string | null
          color: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_contact: string | null
          delivery_date: string | null
          destination: string | null
          destination_address: string | null
          destination_city: string | null
          destination_contact: string | null
          destination_country: string | null
          destination_email: string | null
          destination_phone: string | null
          dimensions: string | null
          distance_km: number | null
          id: string
          insurance_included: boolean | null
          is_running: boolean | null
          license_plate: string | null
          model: string | null
          notes: string | null
          origin: string | null
          origin_address: string | null
          origin_city: string | null
          origin_contact: string | null
          origin_country: string | null
          origin_email: string | null
          origin_phone: string | null
          pickup_address: string | null
          pickup_contact: string | null
          pickup_date: string | null
          quote_amount: number | null
          quote_number: string | null
          requester_id: string
          response_notes: string | null
          special_requirements: string | null
          status: string | null
          transport_date: string | null
          transporter_id: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_condition: string | null
          vehicle_id: string | null
          vehicle_year: number | null
          version: string | null
          weight_kg: number | null
        }
        Insert: {
          brand?: string | null
          chassis_number?: string | null
          color?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_contact?: string | null
          delivery_date?: string | null
          destination?: string | null
          destination_address?: string | null
          destination_city?: string | null
          destination_contact?: string | null
          destination_country?: string | null
          destination_email?: string | null
          destination_phone?: string | null
          dimensions?: string | null
          distance_km?: number | null
          id?: string
          insurance_included?: boolean | null
          is_running?: boolean | null
          license_plate?: string | null
          model?: string | null
          notes?: string | null
          origin?: string | null
          origin_address?: string | null
          origin_city?: string | null
          origin_contact?: string | null
          origin_country?: string | null
          origin_email?: string | null
          origin_phone?: string | null
          pickup_address?: string | null
          pickup_contact?: string | null
          pickup_date?: string | null
          quote_amount?: number | null
          quote_number?: string | null
          requester_id: string
          response_notes?: string | null
          special_requirements?: string | null
          status?: string | null
          transport_date?: string | null
          transporter_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_condition?: string | null
          vehicle_id?: string | null
          vehicle_year?: number | null
          version?: string | null
          weight_kg?: number | null
        }
        Update: {
          brand?: string | null
          chassis_number?: string | null
          color?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_contact?: string | null
          delivery_date?: string | null
          destination?: string | null
          destination_address?: string | null
          destination_city?: string | null
          destination_contact?: string | null
          destination_country?: string | null
          destination_email?: string | null
          destination_phone?: string | null
          dimensions?: string | null
          distance_km?: number | null
          id?: string
          insurance_included?: boolean | null
          is_running?: boolean | null
          license_plate?: string | null
          model?: string | null
          notes?: string | null
          origin?: string | null
          origin_address?: string | null
          origin_city?: string | null
          origin_contact?: string | null
          origin_country?: string | null
          origin_email?: string | null
          origin_phone?: string | null
          pickup_address?: string | null
          pickup_contact?: string | null
          pickup_date?: string | null
          quote_amount?: number | null
          quote_number?: string | null
          requester_id?: string
          response_notes?: string | null
          special_requirements?: string | null
          status?: string | null
          transport_date?: string | null
          transporter_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_condition?: string | null
          vehicle_id?: string | null
          vehicle_year?: number | null
          version?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_quotes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transporter_services: {
        Row: {
          base_price: number | null
          coverage_area: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_vehicle_weight: number | null
          price_per_km: number | null
          service_type: string | null
          transporter_id: string
          vehicle_types: Json | null
        }
        Insert: {
          base_price?: number | null
          coverage_area?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_vehicle_weight?: number | null
          price_per_km?: number | null
          service_type?: string | null
          transporter_id: string
          vehicle_types?: Json | null
        }
        Update: {
          base_price?: number | null
          coverage_area?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_vehicle_weight?: number | null
          price_per_km?: number | null
          service_type?: string | null
          transporter_id?: string
          vehicle_types?: Json | null
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          notification_types: Json | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_types?: Json | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_types?: Json | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          read: boolean | null
          subject: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          read?: boolean | null
          subject?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          read?: boolean | null
          subject?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_vehicle_visits: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          vehicle_id: string | null
          visited_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          vehicle_id?: string | null
          visited_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          vehicle_id?: string | null
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_vehicle_visits_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_damage_images: {
        Row: {
          created_at: string | null
          damage_id: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string
        }
        Insert: {
          created_at?: string | null
          damage_id?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
        }
        Update: {
          created_at?: string | null
          damage_id?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_damage_images_damage_id_fkey"
            columns: ["damage_id"]
            isOneToOne: false
            referencedRelation: "vehicle_damages"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_damages: {
        Row: {
          created_at: string | null
          damage_type: string | null
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          repair_cost: number | null
          severity: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          damage_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          repair_cost?: number | null
          severity?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          damage_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          repair_cost?: number | null
          severity?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_damages_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string | null
          expiry_date: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          vehicle_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url?: string | null
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          vehicle_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string | null
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          vehicle_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_equipment: {
        Row: {
          category: string | null
          created_at: string | null
          equipment_id: string | null
          id: string
          is_standard: boolean | null
          name: string
          vehicle_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          is_standard?: boolean | null
          name: string
          vehicle_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          is_standard?: boolean | null
          name?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_equipment_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_information: {
        Row: {
          additional_notes: string | null
          created_at: string | null
          id: string
          maintenance_history: Json | null
          technical_specs: Json | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string | null
          id?: string
          maintenance_history?: Json | null
          technical_specs?: Json | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          additional_notes?: string | null
          created_at?: string | null
          id?: string
          maintenance_history?: Json | null
          technical_specs?: Json | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_information_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_metadata: {
        Row: {
          additional_notes: string | null
          coc_status: boolean | null
          created_at: string | null
          financing_available: boolean | null
          first_registration_date: string | null
          id: string
          insurance_company: string | null
          itv_expiry: string | null
          iva_status: string | null
          last_service_date: string | null
          mileage_unit: string | null
          next_service_km: number | null
          units: number | null
          vehicle_id: string | null
          warranty_details: string | null
        }
        Insert: {
          additional_notes?: string | null
          coc_status?: boolean | null
          created_at?: string | null
          financing_available?: boolean | null
          first_registration_date?: string | null
          id?: string
          insurance_company?: string | null
          itv_expiry?: string | null
          iva_status?: string | null
          last_service_date?: string | null
          mileage_unit?: string | null
          next_service_km?: number | null
          units?: number | null
          vehicle_id?: string | null
          warranty_details?: string | null
        }
        Update: {
          additional_notes?: string | null
          coc_status?: boolean | null
          created_at?: string | null
          financing_available?: boolean | null
          first_registration_date?: string | null
          id?: string
          insurance_company?: string | null
          itv_expiry?: string | null
          iva_status?: string | null
          last_service_date?: string | null
          mileage_unit?: string | null
          next_service_km?: number | null
          units?: number | null
          vehicle_id?: string | null
          warranty_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_metadata_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_report_deliveries: {
        Row: {
          created_at: string | null
          delivered_by: string | null
          delivery_type: string | null
          file_name: string | null
          file_url: string | null
          id: string
          notes: string | null
          request_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_by?: string | null
          delivery_type?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          request_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_by?: string | null
          delivery_type?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          notes?: string | null
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_report_deliveries_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "vehicle_report_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_report_requests: {
        Row: {
          admin_notes: string | null
          base_price: number | null
          budget_amount: number | null
          budget_breakdown: Json | null
          budget_notes: string | null
          budget_sent_at: string | null
          created_at: string | null
          estimated_delivery_date: string | null
          final_price: number | null
          id: string
          license_plate: string | null
          observations: string | null
          report_type: string | null
          report_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          vehicle_brand: string | null
          vehicle_id: string | null
          vehicle_location: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
          vehicle_year: number | null
          vin: string | null
        }
        Insert: {
          admin_notes?: string | null
          base_price?: number | null
          budget_amount?: number | null
          budget_breakdown?: Json | null
          budget_notes?: string | null
          budget_sent_at?: string | null
          created_at?: string | null
          estimated_delivery_date?: string | null
          final_price?: number | null
          id?: string
          license_plate?: string | null
          observations?: string | null
          report_type?: string | null
          report_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_brand?: string | null
          vehicle_id?: string | null
          vehicle_location?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
          vin?: string | null
        }
        Update: {
          admin_notes?: string | null
          base_price?: number | null
          budget_amount?: number | null
          budget_breakdown?: Json | null
          budget_notes?: string | null
          budget_sent_at?: string | null
          created_at?: string | null
          estimated_delivery_date?: string | null
          final_price?: number | null
          id?: string
          license_plate?: string | null
          observations?: string | null
          report_type?: string | null
          report_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_brand?: string | null
          vehicle_id?: string | null
          vehicle_location?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_report_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_views: {
        Row: {
          created_at: string | null
          id: string
          vehicle_id: string | null
          view_source: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          vehicle_id?: string | null
          view_source?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          vehicle_id?: string | null
          view_source?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_views_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          accepts_exchange: boolean | null
          body_type: string | null
          brand: string
          co2_emissions: number | null
          color: string | null
          commission_amount: number | null
          commission_query: string | null
          commission_sale: boolean | null
          condition: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          destination_city: string | null
          destination_country: string | null
          doors: number | null
          engine_power: number | null
          engine_size: string | null
          features: Json | null
          first_registration_date: string | null
          fuel: string | null
          fuel_type: string | null
          id: string
          images: Json | null
          is_featured: boolean | null
          itv_expiry: string | null
          license_plate: string | null
          location: string | null
          mileage: number | null
          mileage_unit: string | null
          model: string
          needs_repairs: boolean | null
          origin_city: string | null
          origin_country: string | null
          plate_country: string | null
          power_hp: number | null
          previous_owners: number | null
          price: number | null
          public_sale_price: number | null
          registration_date: string | null
          reserved: boolean | null
          seller_city: string | null
          seller_country: string | null
          seller_id: string
          service_history: boolean | null
          sold: boolean | null
          sold_date: string | null
          status: string | null
          thumbnailurl: string | null
          transaction_type: string | null
          transmission: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_type: string | null
          version: string | null
          views_count: number | null
          vin: string | null
          warranty_months: number | null
          year: number | null
        }
        Insert: {
          accepts_exchange?: boolean | null
          body_type?: string | null
          brand: string
          co2_emissions?: number | null
          color?: string | null
          commission_amount?: number | null
          commission_query?: string | null
          commission_sale?: boolean | null
          condition?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          doors?: number | null
          engine_power?: number | null
          engine_size?: string | null
          features?: Json | null
          first_registration_date?: string | null
          fuel?: string | null
          fuel_type?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          itv_expiry?: string | null
          license_plate?: string | null
          location?: string | null
          mileage?: number | null
          mileage_unit?: string | null
          model: string
          needs_repairs?: boolean | null
          origin_city?: string | null
          origin_country?: string | null
          plate_country?: string | null
          power_hp?: number | null
          previous_owners?: number | null
          price?: number | null
          public_sale_price?: number | null
          registration_date?: string | null
          reserved?: boolean | null
          seller_city?: string | null
          seller_country?: string | null
          seller_id: string
          service_history?: boolean | null
          sold?: boolean | null
          sold_date?: string | null
          status?: string | null
          thumbnailurl?: string | null
          transaction_type?: string | null
          transmission?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
          version?: string | null
          views_count?: number | null
          vin?: string | null
          warranty_months?: number | null
          year?: number | null
        }
        Update: {
          accepts_exchange?: boolean | null
          body_type?: string | null
          brand?: string
          co2_emissions?: number | null
          color?: string | null
          commission_amount?: number | null
          commission_query?: string | null
          commission_sale?: boolean | null
          condition?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          doors?: number | null
          engine_power?: number | null
          engine_size?: string | null
          features?: Json | null
          first_registration_date?: string | null
          fuel?: string | null
          fuel_type?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          itv_expiry?: string | null
          license_plate?: string | null
          location?: string | null
          mileage?: number | null
          mileage_unit?: string | null
          model?: string
          needs_repairs?: boolean | null
          origin_city?: string | null
          origin_country?: string | null
          plate_country?: string | null
          power_hp?: number | null
          previous_owners?: number | null
          price?: number | null
          public_sale_price?: number | null
          registration_date?: string | null
          reserved?: boolean | null
          seller_city?: string | null
          seller_country?: string | null
          seller_id?: string
          service_history?: boolean | null
          sold?: boolean | null
          sold_date?: string | null
          status?: string | null
          thumbnailurl?: string | null
          transaction_type?: string | null
          transmission?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
          version?: string | null
          views_count?: number | null
          vin?: string | null
          warranty_months?: number | null
          year?: number | null
        }
        Relationships: []
      }
      workshop_bookings: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          notes: string | null
          scheduled_date: string | null
          service_id: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          vehicle_id: string | null
          workshop_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          service_id?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          workshop_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          service_id?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "workshop_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          workshop_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          workshop_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          workshop_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_update_user_profile: {
        Args: { p_profile_data: Json; p_user_id: string }
        Returns: boolean
      }
      admin_update_user_role: {
        Args: {
          p_new_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      approve_api_key_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      create_system_notification:
        | {
            Args: {
              p_link?: string
              p_message?: string
              p_subject?: string
              p_title: string
              p_type?: string
              p_user_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_content?: string
              p_link?: string
              p_message?: string
              p_subject?: string
              p_title: string
              p_type?: string
              p_user_id: string
            }
            Returns: string
          }
      generate_api_key: {
        Args: { p_name: string; p_user_id: string }
        Returns: string
      }
      get_user_rating_summary: { Args: { p_user_id: string }; Returns: Json }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      log_activity: {
        Args: {
          p_action_type: string
          p_details?: Json
          p_entity_id?: string
          p_entity_type?: string
          p_user_id: string
        }
        Returns: string
      }
      place_bid: {
        Args: { p_amount: number; p_auction_id: string; p_bidder_id: string }
        Returns: string
      }
      reject_api_key_request: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      soft_delete_conversation: {
        Args: { p_conversation_id: string }
        Returns: boolean
      }
      validate_profile_data_transfer: {
        Args: { p_registration_id?: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "dealer"
        | "professional"
        | "individual"
        | "user"
        | "fleet_manager"
        | "transporter"
        | "workshop"
        | "analyst"
        | "content_manager"
      dispute_priority: "low" | "medium" | "high" | "urgent"
      dispute_status: "open" | "in_progress" | "resolved" | "closed"
      dispute_type:
        | "vehicle_issue"
        | "payment"
        | "communication"
        | "fraud"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "dealer",
        "professional",
        "individual",
        "user",
        "fleet_manager",
        "transporter",
        "workshop",
        "analyst",
        "content_manager",
      ],
      dispute_priority: ["low", "medium", "high", "urgent"],
      dispute_status: ["open", "in_progress", "resolved", "closed"],
      dispute_type: [
        "vehicle_issue",
        "payment",
        "communication",
        "fraud",
        "other",
      ],
    },
  },
} as const

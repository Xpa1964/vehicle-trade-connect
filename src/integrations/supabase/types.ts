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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          severity: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_bulk_messages: {
        Row: {
          admin_name: string
          admin_user_id: string
          created_at: string
          id: string
          message_content: string
          recipient_count: number
          recipients_data: Json | null
          selected_language: string
          send_status: string | null
          updated_at: string
        }
        Insert: {
          admin_name: string
          admin_user_id: string
          created_at?: string
          id?: string
          message_content: string
          recipient_count?: number
          recipients_data?: Json | null
          selected_language?: string
          send_status?: string | null
          updated_at?: string
        }
        Update: {
          admin_name?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          message_content?: string
          recipient_count?: number
          recipients_data?: Json | null
          selected_language?: string
          send_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_config: {
        Row: {
          created_at: string | null
          description: string | null
          key: string
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          key: string
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          key?: string
          value?: Json
        }
        Relationships: []
      }
      announcement_attachments: {
        Row: {
          announcement_id: string
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ann_attachments"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          attachment_name: string | null
          attachment_size: number | null
          attachment_url: string | null
          category: string
          content: string
          created_at: string
          featured_until: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          original_language: string | null
          priority: number | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          category?: string
          content: string
          created_at?: string
          featured_until?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          original_language?: string | null
          priority?: number | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          category?: string
          content?: string
          created_at?: string
          featured_until?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          original_language?: string | null
          priority?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      api_key_requests: {
        Row: {
          created_at: string
          id: string
          name: string
          reason: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          reason?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          reason?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      api_sync_logs: {
        Row: {
          action: string
          api_key_id: string | null
          created_at: string
          error_count: number | null
          errors: Json | null
          id: string
          request_id: string | null
          success_count: number | null
          user_id: string
          vehicle_count: number | null
        }
        Insert: {
          action: string
          api_key_id?: string | null
          created_at?: string
          error_count?: number | null
          errors?: Json | null
          id?: string
          request_id?: string | null
          success_count?: number | null
          user_id: string
          vehicle_count?: number | null
        }
        Update: {
          action?: string
          api_key_id?: string | null
          created_at?: string
          error_count?: number | null
          errors?: Json | null
          id?: string
          request_id?: string | null
          success_count?: number | null
          user_id?: string
          vehicle_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_sync_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "partner_api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_audit_log: {
        Row: {
          action: string
          auction_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          auction_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          auction_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_audit_log_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_notifications: {
        Row: {
          auction_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean
          type: string
          user_id: string
        }
        Insert: {
          auction_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          type: string
          user_id: string
        }
        Update: {
          auction_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_notifications_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_policies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          policy_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          policy_type: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          policy_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      auctions: {
        Row: {
          created_at: string
          created_by: string
          current_price: number
          description: string | null
          end_date: string
          hidden_at: string | null
          id: string
          increment_minimum: number
          reserve_price: number | null
          seller_accepted_at: string | null
          seller_accepted_bid_id: string | null
          start_date: string
          starting_price: number
          status: Database["public"]["Enums"]["auction_status"]
          terms_accepted: boolean
          updated_at: string
          vehicle_id: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          current_price: number
          description?: string | null
          end_date: string
          hidden_at?: string | null
          id?: string
          increment_minimum?: number
          reserve_price?: number | null
          seller_accepted_at?: string | null
          seller_accepted_bid_id?: string | null
          start_date: string
          starting_price: number
          status?: Database["public"]["Enums"]["auction_status"]
          terms_accepted?: boolean
          updated_at?: string
          vehicle_id: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          current_price?: number
          description?: string | null
          end_date?: string
          hidden_at?: string | null
          id?: string
          increment_minimum?: number
          reserve_price?: number | null
          seller_accepted_at?: string | null
          seller_accepted_bid_id?: string | null
          start_date?: string
          starting_price?: number
          status?: Database["public"]["Enums"]["auction_status"]
          terms_accepted?: boolean
          updated_at?: string
          vehicle_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_seller_accepted_bid_id_fkey"
            columns: ["seller_accepted_bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at?: string
          id?: string
          status?: string
        }
        Update: {
          amount?: number
          auction_id?: string
          bidder_id?: string
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          admin_sender_name: string | null
          buyer_deleted_at: string | null
          buyer_id: string
          created_at: string
          deleted_by_buyer: boolean | null
          deleted_by_seller: boolean | null
          id: string
          is_admin_conversation: boolean | null
          is_pinned: boolean | null
          seller_deleted_at: string | null
          seller_id: string | null
          source_id: string | null
          source_title: string | null
          source_type: string | null
          status: string
          unread_count: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          admin_sender_name?: string | null
          buyer_deleted_at?: string | null
          buyer_id: string
          created_at?: string
          deleted_by_buyer?: boolean | null
          deleted_by_seller?: boolean | null
          id?: string
          is_admin_conversation?: boolean | null
          is_pinned?: boolean | null
          seller_deleted_at?: string | null
          seller_id?: string | null
          source_id?: string | null
          source_title?: string | null
          source_type?: string | null
          status?: string
          unread_count?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          admin_sender_name?: string | null
          buyer_deleted_at?: string | null
          buyer_id?: string
          created_at?: string
          deleted_by_buyer?: boolean | null
          deleted_by_seller?: boolean | null
          id?: string
          is_admin_conversation?: boolean | null
          is_pinned?: boolean | null
          seller_deleted_at?: string | null
          seller_id?: string | null
          source_id?: string | null
          source_title?: string | null
          source_type?: string | null
          status?: string
          unread_count?: number | null
          updated_at?: string
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
      dispute_authorization_documents: {
        Row: {
          claimant_agreed: boolean
          claimant_signature: string | null
          claimant_signed_at: string | null
          created_at: string
          dispute_id: string
          document_template: string
          document_version: string
          id: string
          is_active: boolean
          respondent_agreed: boolean
          respondent_signature: string | null
          respondent_signed_at: string | null
        }
        Insert: {
          claimant_agreed?: boolean
          claimant_signature?: string | null
          claimant_signed_at?: string | null
          created_at?: string
          dispute_id: string
          document_template: string
          document_version?: string
          id?: string
          is_active?: boolean
          respondent_agreed?: boolean
          respondent_signature?: string | null
          respondent_signed_at?: string | null
        }
        Update: {
          claimant_agreed?: boolean
          claimant_signature?: string | null
          claimant_signed_at?: string | null
          created_at?: string
          dispute_id?: string
          document_template?: string
          document_version?: string
          id?: string
          is_active?: boolean
          respondent_agreed?: boolean
          respondent_signature?: string | null
          respondent_signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_authorization_documents_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "dispute_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_cases: {
        Row: {
          auction_id: string | null
          case_number: string
          claimant_id: string
          claimed_amount: number | null
          closed_at: string | null
          conversation_id: string | null
          created_at: string
          deadline_date: string | null
          description: string
          dispute_type: Database["public"]["Enums"]["dispute_type"]
          id: string
          manager_id: string | null
          priority: Database["public"]["Enums"]["dispute_priority"]
          proposed_solution: string | null
          resolution_summary: string | null
          respondent_id: string
          satisfaction_rating: number | null
          specialist_id: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          title: string
          transaction_id: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          auction_id?: string | null
          case_number?: string
          claimant_id: string
          claimed_amount?: number | null
          closed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          deadline_date?: string | null
          description: string
          dispute_type: Database["public"]["Enums"]["dispute_type"]
          id?: string
          manager_id?: string | null
          priority?: Database["public"]["Enums"]["dispute_priority"]
          proposed_solution?: string | null
          resolution_summary?: string | null
          respondent_id: string
          satisfaction_rating?: number | null
          specialist_id?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          title: string
          transaction_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          auction_id?: string | null
          case_number?: string
          claimant_id?: string
          claimed_amount?: number | null
          closed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          deadline_date?: string | null
          description?: string
          dispute_type?: Database["public"]["Enums"]["dispute_type"]
          id?: string
          manager_id?: string | null
          priority?: Database["public"]["Enums"]["dispute_priority"]
          proposed_solution?: string | null
          resolution_summary?: string | null
          respondent_id?: string
          satisfaction_rating?: number | null
          specialist_id?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          title?: string
          transaction_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_cases_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_cases_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_cases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_cases_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_evidence: {
        Row: {
          created_at: string
          description: string | null
          dispute_id: string
          evidence_type: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          is_primary: boolean
          submitted_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dispute_id: string
          evidence_type: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          is_primary?: boolean
          submitted_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dispute_id?: string
          evidence_type?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          is_primary?: boolean
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_evidence_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "dispute_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          content: string
          created_at: string
          dispute_id: string
          id: string
          is_internal: boolean
          message_type: string
          read_by_claimant: boolean
          read_by_respondent: boolean
          read_by_specialist: boolean
          sender_id: string
          sender_type: string
        }
        Insert: {
          content: string
          created_at?: string
          dispute_id: string
          id?: string
          is_internal?: boolean
          message_type?: string
          read_by_claimant?: boolean
          read_by_respondent?: boolean
          read_by_specialist?: boolean
          sender_id: string
          sender_type: string
        }
        Update: {
          content?: string
          created_at?: string
          dispute_id?: string
          id?: string
          is_internal?: boolean
          message_type?: string
          read_by_claimant?: boolean
          read_by_respondent?: boolean
          read_by_specialist?: boolean
          sender_id?: string
          sender_type?: string
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
      dispute_system_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment_items: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          standard_name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          standard_name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          standard_name?: string
          updated_at?: string
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
          compensation: number | null
          conditions: string[] | null
          conversation_id: string | null
          created_at: string | null
          id: string
          initiator_id: string | null
          initiator_vehicle_id: string | null
          offered_vehicle_id: string | null
          requested_vehicle_id: string | null
          status: string | null
          target_vehicle_id: string | null
          updated_at: string | null
        }
        Insert: {
          compensation?: number | null
          conditions?: string[] | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          initiator_id?: string | null
          initiator_vehicle_id?: string | null
          offered_vehicle_id?: string | null
          requested_vehicle_id?: string | null
          status?: string | null
          target_vehicle_id?: string | null
          updated_at?: string | null
        }
        Update: {
          compensation?: number | null
          conditions?: string[] | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          initiator_id?: string | null
          initiator_vehicle_id?: string | null
          offered_vehicle_id?: string | null
          requested_vehicle_id?: string | null
          status?: string | null
          target_vehicle_id?: string | null
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
            foreignKeyName: "exchanges_initiator_vehicle_id_fkey"
            columns: ["initiator_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
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
          {
            foreignKeyName: "exchanges_target_vehicle_id_fkey"
            columns: ["target_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          original_language: string | null
          read_at: string | null
          sender_id: string | null
          translated_content: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          original_language?: string | null
          read_at?: string | null
          sender_id?: string | null
          translated_content?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          original_language?: string | null
          read_at?: string | null
          sender_id?: string | null
          translated_content?: Json | null
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
      notification_history: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          email_failed_count: number | null
          email_sent_count: number | null
          failed_count: number | null
          id: string
          recipient_count: number | null
          recipient_details: Json | null
          send_via_email: boolean | null
          sent_at: string | null
          sent_count: number | null
          status: string | null
          subject: string
          template_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          email_failed_count?: number | null
          email_sent_count?: number | null
          failed_count?: number | null
          id?: string
          recipient_count?: number | null
          recipient_details?: Json | null
          send_via_email?: boolean | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject: string
          template_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          email_failed_count?: number | null
          email_sent_count?: number | null
          failed_count?: number | null
          id?: string
          recipient_count?: number | null
          recipient_details?: Json | null
          send_via_email?: boolean | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject?: string
          template_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_recipients: {
        Row: {
          created_at: string | null
          email: string
          error_message: string | null
          id: string
          name: string
          notification_history_id: string | null
          sent_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          name: string
          notification_history_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          name?: string
          notification_history_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_history_id_fkey"
            columns: ["notification_history_id"]
            isOneToOne: false
            referencedRelation: "notification_history"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          type: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id: string
          is_active?: boolean | null
          name: string
          subject: string
          type: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          type?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      optimization_log: {
        Row: {
          action: string
          configuration: Json
          created_at: string
          id: string
          is_automatic: boolean
          optimization_type: string
          rollback_available: boolean
          rolled_back_at: string | null
          trigger_reason: string
          user_count: number
        }
        Insert: {
          action: string
          configuration?: Json
          created_at?: string
          id?: string
          is_automatic?: boolean
          optimization_type: string
          rollback_available?: boolean
          rolled_back_at?: string | null
          trigger_reason: string
          user_count: number
        }
        Update: {
          action?: string
          configuration?: Json
          created_at?: string
          id?: string
          is_automatic?: boolean
          optimization_type?: string
          rollback_available?: boolean
          rolled_back_at?: string | null
          trigger_reason?: string
          user_count?: number
        }
        Relationships: []
      }
      partner_api_keys: {
        Row: {
          api_key: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          last_used_at: string | null
          name: string
          rate_limit_per_hour: number | null
          request_count: number | null
          request_id: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          name: string
          rate_limit_per_hour?: number | null
          request_count?: number | null
          request_id?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          name?: string
          rate_limit_per_hour?: number | null
          request_count?: number | null
          request_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_api_keys_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "api_key_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_alerts: {
        Row: {
          alert_type: string
          created_at: string
          current_value: number
          id: string
          is_active: boolean
          message: string
          resolved_at: string | null
          threshold_value: number
        }
        Insert: {
          alert_type: string
          created_at?: string
          current_value: number
          id?: string
          is_active?: boolean
          message: string
          resolved_at?: string | null
          threshold_value: number
        }
        Update: {
          alert_type?: string
          created_at?: string
          current_value?: number
          id?: string
          is_active?: boolean
          message?: string
          resolved_at?: string | null
          threshold_value?: number
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          active_queries: number
          active_users: number
          average_response_time: number
          cpu_usage: number
          created_at: string
          db_queries_per_minute: number
          error_count: number
          id: string
          memory_usage: number
          realtime_channels: number
          timestamp: string
        }
        Insert: {
          active_queries?: number
          active_users?: number
          average_response_time?: number
          cpu_usage?: number
          created_at?: string
          db_queries_per_minute?: number
          error_count?: number
          id?: string
          memory_usage?: number
          realtime_channels?: number
          timestamp?: string
        }
        Update: {
          active_queries?: number
          active_users?: number
          average_response_time?: number
          cpu_usage?: number
          created_at?: string
          db_queries_per_minute?: number
          error_count?: number
          id?: string
          memory_usage?: number
          realtime_channels?: number
          timestamp?: string
        }
        Relationships: []
      }
      performance_optimizations: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          created_at: string
          id: string
          is_enabled: boolean
          level: string | null
          optimization_type: string
          updated_at: string
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          level?: string | null
          optimization_type: string
          updated_at?: string
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          level?: string | null
          optimization_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      premium_report_batches: {
        Row: {
          batch_number: string
          completed_date: string | null
          created_at: string
          id: string
          inspector_notes: string | null
          request_ids: string[]
          scheduled_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          batch_number: string
          completed_date?: string | null
          created_at?: string
          id?: string
          inspector_notes?: string | null
          request_ids: string[]
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string
          completed_date?: string | null
          created_at?: string
          id?: string
          inspector_notes?: string | null
          request_ids?: string[]
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          business_type: string | null
          company_logo: string | null
          company_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          operations_breakdown: Json | null
          preferred_language: string | null
          registration_date: string | null
          show_business_stats: boolean | null
          show_contact_details: boolean | null
          show_location_details: boolean | null
          total_operations: number | null
          trader_type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          company_logo?: string | null
          company_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          operations_breakdown?: Json | null
          preferred_language?: string | null
          registration_date?: string | null
          show_business_stats?: boolean | null
          show_contact_details?: boolean | null
          show_location_details?: boolean | null
          total_operations?: number | null
          trader_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string | null
          company_logo?: string | null
          company_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          operations_breakdown?: Json | null
          preferred_language?: string | null
          registration_date?: string | null
          show_business_stats?: boolean | null
          show_contact_details?: boolean | null
          show_location_details?: boolean | null
          total_operations?: number | null
          trader_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string
          created_at: string
          from_user_id: string
          id: string
          rating: number
          to_user_id: string
          transaction_id: string | null
          transaction_type: string | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          comment: string
          created_at?: string
          from_user_id: string
          id?: string
          rating: number
          to_user_id: string
          transaction_id?: string | null
          transaction_type?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          comment?: string
          created_at?: string
          from_user_id?: string
          id?: string
          rating?: number
          to_user_id?: string
          transaction_id?: string | null
          transaction_type?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      recommendation_cache: {
        Row: {
          algorithm_version: string
          confidence_score: number | null
          expires_at: string
          generated_at: string
          id: string
          reasoning: Json | null
          recommended_vehicles: Json
          user_id: string
        }
        Insert: {
          algorithm_version?: string
          confidence_score?: number | null
          expires_at?: string
          generated_at?: string
          id?: string
          reasoning?: Json | null
          recommended_vehicles?: Json
          user_id: string
        }
        Update: {
          algorithm_version?: string
          confidence_score?: number | null
          expires_at?: string
          generated_at?: string
          id?: string
          reasoning?: Json | null
          recommended_vehicles?: Json
          user_id?: string
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          admin_notes: string | null
          business_type: string | null
          city: string | null
          company_logo: string | null
          company_name: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          description: string | null
          documents_paths: string[] | null
          email: string
          id: string
          manager_name: string | null
          phone: string | null
          postal_code: string | null
          status: string
          trader_type: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          business_type?: string | null
          city?: string | null
          company_logo?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          documents_paths?: string[] | null
          email: string
          id?: string
          manager_name?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string
          trader_type?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          business_type?: string | null
          city?: string | null
          company_logo?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          documents_paths?: string[] | null
          email?: string
          id?: string
          manager_name?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string
          trader_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          buyer_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          seller_id: string | null
          status: string | null
          transaction_type: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          amount?: number | null
          buyer_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          seller_id?: string | null
          status?: string | null
          transaction_type: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number | null
          buyer_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          seller_id?: string | null
          status?: string | null
          transaction_type?: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_cache: {
        Row: {
          created_at: string
          id: string
          last_used_at: string
          original_language: string
          original_text: string
          target_language: string
          translated_text: string
          use_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_used_at?: string
          original_language: string
          original_text: string
          target_language: string
          translated_text: string
          use_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_used_at?: string
          original_language?: string
          original_text?: string
          target_language?: string
          translated_text?: string
          use_count?: number
        }
        Relationships: []
      }
      transport_quote_responses: {
        Row: {
          admin_notes: string | null
          admin_user_id: string
          created_at: string
          estimated_delivery_date: string | null
          estimated_pickup_date: string | null
          id: string
          quoted_price: number | null
          response_status: string
          terms_and_conditions: string | null
          transport_quote_id: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          admin_user_id: string
          created_at?: string
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          id?: string
          quoted_price?: number | null
          response_status?: string
          terms_and_conditions?: string | null
          transport_quote_id: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          admin_user_id?: string
          created_at?: string
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          id?: string
          quoted_price?: number | null
          response_status?: string
          terms_and_conditions?: string | null
          transport_quote_id?: string
          updated_at?: string
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
          brand: string
          chassis_number: string
          color: string
          created_at: string
          destination_address: string
          destination_city: string
          destination_contact: string
          destination_country: string
          destination_email: string
          destination_phone: string
          id: string
          license_plate: string
          model: string
          origin_address: string
          origin_city: string
          origin_contact: string
          origin_country: string
          origin_email: string
          origin_phone: string
          quote_number: string
          status: string
          transport_date: string
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          brand: string
          chassis_number: string
          color: string
          created_at?: string
          destination_address: string
          destination_city: string
          destination_contact: string
          destination_country: string
          destination_email: string
          destination_phone: string
          id?: string
          license_plate: string
          model: string
          origin_address: string
          origin_city: string
          origin_contact: string
          origin_country: string
          origin_email: string
          origin_phone: string
          quote_number?: string
          status?: string
          transport_date: string
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          brand?: string
          chassis_number?: string
          color?: string
          created_at?: string
          destination_address?: string
          destination_city?: string
          destination_contact?: string
          destination_country?: string
          destination_email?: string
          destination_phone?: string
          id?: string
          license_plate?: string
          model?: string
          origin_address?: string
          origin_city?: string
          origin_contact?: string
          origin_country?: string
          origin_email?: string
          origin_phone?: string
          quote_number?: string
          status?: string
          transport_date?: string
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          notification_history_id: string | null
          read_at: string | null
          subject: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_history_id?: string | null
          read_at?: string | null
          subject: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_history_id?: string | null
          read_at?: string | null
          subject?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_notification_history_id_fkey"
            columns: ["notification_history_id"]
            isOneToOne: false
            referencedRelation: "notification_history"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      user_vehicle_visits: {
        Row: {
          id: string
          interaction_type: string | null
          source_page: string | null
          user_id: string
          vehicle_id: string
          visit_duration: number | null
          visited_at: string
        }
        Insert: {
          id?: string
          interaction_type?: string | null
          source_page?: string | null
          user_id: string
          vehicle_id: string
          visit_duration?: number | null
          visited_at?: string
        }
        Update: {
          id?: string
          interaction_type?: string | null
          source_page?: string | null
          user_id?: string
          vehicle_id?: string
          visit_duration?: number | null
          visited_at?: string
        }
        Relationships: []
      }
      vehicle_damage_images: {
        Row: {
          created_at: string
          damage_id: string
          description: string | null
          display_order: number
          id: string
          image_url: string
        }
        Insert: {
          created_at?: string
          damage_id: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
        }
        Update: {
          created_at?: string
          damage_id?: string
          description?: string | null
          display_order?: number
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
          created_at: string
          damage_type: string
          description: string | null
          estimated_cost: number | null
          id: string
          location: string | null
          severity: string
          title: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          damage_type: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          severity?: string
          title: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          damage_type?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          severity?: string
          title?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          updated_at: string | null
          uploaded_by: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
          vehicle_id?: string | null
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
          created_at: string
          equipment_id: string
          id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          equipment_id: string
          id?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          equipment_id?: string
          id?: string
          vehicle_id?: string
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
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_primary: boolean
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_primary?: boolean
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_primary?: boolean
          updated_at?: string
          vehicle_id?: string
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
          created_at: string
          id: string
          maintenance_history: Json | null
          technical_specs: Json | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          id?: string
          maintenance_history?: Json | null
          technical_specs?: Json | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          id?: string
          maintenance_history?: Json | null
          technical_specs?: Json | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_information_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_metadata: {
        Row: {
          coc_status: boolean
          created_at: string | null
          fuel_type: string | null
          id: string
          iva_status: string
          mileage_unit: string
          transmission: string | null
          units: number
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          coc_status?: boolean
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          iva_status?: string
          mileage_unit?: string
          transmission?: string | null
          units?: number
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          coc_status?: boolean
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          iva_status?: string
          mileage_unit?: string
          transmission?: string | null
          units?: number
          updated_at?: string | null
          vehicle_id?: string
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
          created_at: string
          file_category: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_primary: boolean | null
          request_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_category?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_primary?: boolean | null
          request_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_category?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_primary?: boolean | null
          request_id?: string
          uploaded_by?: string
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
      vehicle_report_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_proof_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          request_id: string
          stripe_payment_intent_id: string | null
          transfer_reference: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          request_id: string
          stripe_payment_intent_id?: string | null
          transfer_reference?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          request_id?: string
          stripe_payment_intent_id?: string | null
          transfer_reference?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_report_payments_request_id_fkey"
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
          budget_accepted_at: string | null
          budget_amount: number | null
          budget_breakdown: Json | null
          budget_notes: string | null
          budget_rejected_at: string | null
          budget_sent_at: string | null
          created_at: string
          estimated_delivery_date: string | null
          final_price: number | null
          id: string
          observations: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          status: Database["public"]["Enums"]["report_request_status"]
          updated_at: string
          urgency_level: string | null
          user_id: string
          vehicle_brand: string | null
          vehicle_count: number | null
          vehicle_location: string | null
          vehicle_model: string | null
          vehicle_plate: string
          vehicle_year: number | null
        }
        Insert: {
          admin_notes?: string | null
          base_price?: number | null
          budget_accepted_at?: string | null
          budget_amount?: number | null
          budget_breakdown?: Json | null
          budget_notes?: string | null
          budget_rejected_at?: string | null
          budget_sent_at?: string | null
          created_at?: string
          estimated_delivery_date?: string | null
          final_price?: number | null
          id?: string
          observations?: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          status?: Database["public"]["Enums"]["report_request_status"]
          updated_at?: string
          urgency_level?: string | null
          user_id: string
          vehicle_brand?: string | null
          vehicle_count?: number | null
          vehicle_location?: string | null
          vehicle_model?: string | null
          vehicle_plate: string
          vehicle_year?: number | null
        }
        Update: {
          admin_notes?: string | null
          base_price?: number | null
          budget_accepted_at?: string | null
          budget_amount?: number | null
          budget_breakdown?: Json | null
          budget_notes?: string | null
          budget_rejected_at?: string | null
          budget_sent_at?: string | null
          created_at?: string
          estimated_delivery_date?: string | null
          final_price?: number | null
          id?: string
          observations?: string | null
          report_type?: Database["public"]["Enums"]["report_type"]
          status?: Database["public"]["Enums"]["report_request_status"]
          updated_at?: string
          urgency_level?: string | null
          user_id?: string
          vehicle_brand?: string | null
          vehicle_count?: number | null
          vehicle_location?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle_report_requests_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vehicle_report_requests_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          accepts_exchange: boolean | null
          brand: string
          color: string | null
          commission_amount: number | null
          commission_query: string | null
          commission_sale: boolean | null
          condition: string
          country: string | null
          country_code: string | null
          created_at: string | null
          description: string | null
          doors: number | null
          engine_power: number | null
          engine_size: number | null
          fuel: string | null
          gallery: string | null
          id: string
          license_plate: string | null
          location: string | null
          mileage: number | null
          model: string
          price: number | null
          public_sale_price: number | null
          registration_date: string | null
          status: string | null
          thumbnailurl: string | null
          transaction_type: string | null
          transmission: string | null
          type: string
          updated_at: string | null
          user_id: string | null
          vehicle_type: string | null
          vin: string | null
          year: number
        }
        Insert: {
          accepts_exchange?: boolean | null
          brand: string
          color?: string | null
          commission_amount?: number | null
          commission_query?: string | null
          commission_sale?: boolean | null
          condition: string
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          doors?: number | null
          engine_power?: number | null
          engine_size?: number | null
          fuel?: string | null
          gallery?: string | null
          id?: string
          license_plate?: string | null
          location?: string | null
          mileage?: number | null
          model: string
          price?: number | null
          public_sale_price?: number | null
          registration_date?: string | null
          status?: string | null
          thumbnailurl?: string | null
          transaction_type?: string | null
          transmission?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
          vin?: string | null
          year: number
        }
        Update: {
          accepts_exchange?: boolean | null
          brand?: string
          color?: string | null
          commission_amount?: number | null
          commission_query?: string | null
          commission_sale?: boolean | null
          condition?: string
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          doors?: number | null
          engine_power?: number | null
          engine_size?: number | null
          fuel?: string | null
          gallery?: string | null
          id?: string
          license_plate?: string | null
          location?: string | null
          mileage?: number | null
          model?: string
          price?: number | null
          public_sale_price?: number | null
          registration_date?: string | null
          status?: string | null
          thumbnailurl?: string | null
          transaction_type?: string | null
          transmission?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          company_logo: string | null
          company_name: string | null
          country: string | null
          id: string | null
          operations_breakdown: Json | null
          registration_date: string | null
          total_operations: number | null
          trader_type: string | null
        }
        Insert: {
          company_logo?: never
          company_name?: string | null
          country?: string | null
          id?: string | null
          operations_breakdown?: Json | null
          registration_date?: string | null
          total_operations?: number | null
          trader_type?: string | null
        }
        Update: {
          company_logo?: never
          company_name?: string | null
          country?: string | null
          id?: string | null
          operations_breakdown?: Json | null
          registration_date?: string | null
          total_operations?: number | null
          trader_type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_auction_result: { Args: { p_auction_id: string }; Returns: Json }
      accept_bid: {
        Args: { p_auction_id: string; p_bid_id: string }
        Returns: Json
      }
      admin_update_user_profile: {
        Args: {
          p_address: string
          p_business_type: string
          p_company_name: string
          p_contact_phone: string
          p_country: string
          p_full_name: string
          p_trader_type: string
          p_user_id: string
        }
        Returns: Json
      }
      admin_update_user_role: {
        Args: { p_new_role: string; p_user_id: string }
        Returns: Json
      }
      approve_api_key_request: {
        Args: { p_key_name: string; p_request_id: string }
        Returns: Json
      }
      can_view_profile: { Args: { profile_user_id: string }; Returns: boolean }
      cancel_auction: { Args: { auction_id: string }; Returns: Json }
      cleanup_old_metrics: { Args: never; Returns: number }
      cleanup_old_rate_limits: { Args: never; Returns: number }
      close_expired_auctions: { Args: never; Returns: number }
      create_system_notification: {
        Args: {
          p_content: string
          p_notification_history_id?: string
          p_subject: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      end_auction: { Args: { auction_id: string }; Returns: Json }
      generate_api_key: { Args: never; Returns: string }
      generate_case_number: { Args: never; Returns: string }
      get_unread_auction_notifications: {
        Args: { p_limit?: number }
        Returns: {
          auction_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean
          type: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "auction_notifications"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_dashboard_stats: { Args: { user_uuid: string }; Returns: Json }
      get_user_rating_summary: {
        Args: { p_user_id: string }
        Returns: {
          average_rating: number
          total_ratings: number
          verified_ratings: number
        }[]
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_vehicle_interested_contacts: {
        Args: { p_vehicle_id: string }
        Returns: {
          contact_phone: string
          email: string
          full_name: string
          user_id: string
        }[]
      }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { p_role: string }; Returns: boolean }
      log_activity: {
        Args: {
          p_action_type: string
          p_details?: Json
          p_entity_id?: string
          p_entity_type?: string
          p_severity?: string
          p_user_id: string
        }
        Returns: string
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      place_bid: {
        Args: { p_amount: number; p_auction_id: string }
        Returns: Json
      }
      reject_api_key_request: {
        Args: { p_rejection_reason: string; p_request_id: string }
        Returns: Json
      }
      reject_auction_result: { Args: { p_auction_id: string }; Returns: Json }
      reset_unread_count: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      soft_delete_conversation: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: boolean
      }
      start_auction: { Args: { auction_id: string }; Returns: boolean }
      toggle_conversation_pin: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: boolean
      }
      validate_partner_api_key: { Args: { p_api_key: string }; Returns: string }
      validate_partner_api_key_with_rate_limit: {
        Args: { p_api_key: string }
        Returns: Json
      }
      validate_profile_data_transfer: {
        Args: { p_registration_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "dealer" | "user"
      auction_status:
        | "scheduled"
        | "active"
        | "ended"
        | "cancelled"
        | "completed"
      dispute_priority: "low" | "medium" | "high" | "urgent"
      dispute_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "awaiting_counterparty"
        | "authorization_pending"
        | "mediation"
        | "resolution_proposed"
        | "accepted"
        | "rejected"
        | "closed"
        | "escalated"
      dispute_type:
        | "product_quality"
        | "delivery_issue"
        | "payment_problem"
        | "description_mismatch"
        | "damage_in_transit"
        | "fraud_concern"
        | "contract_breach"
        | "other"
      payment_method: "card" | "transfer"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      report_request_status:
        | "draft"
        | "pending"
        | "budgeted"
        | "paid"
        | "in_process"
        | "delivered"
        | "rejected"
        | "budget_accepted"
        | "budget_rejected"
      report_type: "basic" | "technical" | "premium"
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
      app_role: ["admin", "dealer", "user"],
      auction_status: [
        "scheduled",
        "active",
        "ended",
        "cancelled",
        "completed",
      ],
      dispute_priority: ["low", "medium", "high", "urgent"],
      dispute_status: [
        "draft",
        "submitted",
        "under_review",
        "awaiting_counterparty",
        "authorization_pending",
        "mediation",
        "resolution_proposed",
        "accepted",
        "rejected",
        "closed",
        "escalated",
      ],
      dispute_type: [
        "product_quality",
        "delivery_issue",
        "payment_problem",
        "description_mismatch",
        "damage_in_transit",
        "fraud_concern",
        "contract_breach",
        "other",
      ],
      payment_method: ["card", "transfer"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      report_request_status: [
        "draft",
        "pending",
        "budgeted",
        "paid",
        "in_process",
        "delivered",
        "rejected",
        "budget_accepted",
        "budget_rejected",
      ],
      report_type: ["basic", "technical", "premium"],
    },
  },
} as const

-- Add missing foreign key constraints for auction system

-- Add foreign key from auctions.created_by to profiles
ALTER TABLE auctions 
ADD CONSTRAINT auctions_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Add foreign key from auctions.winner_id to profiles
ALTER TABLE auctions 
ADD CONSTRAINT auctions_winner_id_fkey 
FOREIGN KEY (winner_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL;

-- Add foreign key from bids.bidder_id to profiles
ALTER TABLE bids 
ADD CONSTRAINT bids_bidder_id_fkey 
FOREIGN KEY (bidder_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;